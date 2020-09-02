import { Catenary } from 'catenary-curve'
import { LazyBrush } from 'lazy-brush'
import React, { PureComponent } from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import { drawImageProp } from './utils'

function midPointBtw(p1, p2) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  }
}

const setCanvasSize = (canvas, width, height) => {
  canvas.width = width
  canvas.height = height
  canvas.style.width = width
  canvas.style.height = height
}

const canvasStyle = {
  display: 'block',
  position: 'absolute',
}

const canvasTypes = [
  {
    name: 'interface',
    zIndex: 15,
  },
  {
    name: 'drawing',
    zIndex: 11,
  },
  {
    name: 'temp',
    zIndex: 12,
  },
  {
    name: 'grid',
    zIndex: 10,
  },
]

export class CanvasImageOverlay extends PureComponent {
  static defaultProps = {
    image: null,
    overlayImage: null,

    isDisabled: false,

    canvasWidth: 400,
    canvasHeight: 400,

    brushColor: '#444',
    brushRadius: 10,

    catenaryColor: '#0a0302',

    gridColor: 'rgba(150,150,150,0.17)',
    hideGrid: false,
  }

  constructor(props) {
    super(props)

    this.canvas = {}
    this.ctx = {}

    this.catenary = new Catenary()

    this.points = []
    this.lines = []

    this.mouseHasMoved = true
    this.valuesChanged = true
    this.isDrawing = false
    this.isPressing = false

    this.prevHeight = this.props.canvasHeight
    this.prevWidth = this.props.canvasWidth

    this.canvasObserver = new ResizeObserver((entries) => {
      this.handleCanvasResize(entries)
    })

    this.brushRadius = 10
  }

  componentDidMount() {
    this.lazy = new LazyBrush({
      radius: this.props.brushRadius * window.devicePixelRatio,
      enabled: true,
      initialPoint: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      },
    })

    this.chainLength = this.props.brushRadius * window.devicePixelRatio

    this.canvasObserver.observe(this.canvasContainer)

    this.drawImage()

    this.loop()

    window.setTimeout(() => {
      const initX = window.innerWidth / 2
      const initY = window.innerHeight / 2
      this.lazy.update(
        { x: initX - this.chainLength / 4, y: initY },
        { both: true }
      )
      this.lazy.update(
        { x: initX + this.chainLength / 4, y: initY },
        { both: false }
      )
      this.mouseHasMoved = true
      this.valuesChanged = true
      this.clearCanvas()
      this.drawOverlayImage()
    }, 100)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.brushRadius !== this.props.brushRadius) {
      // Set new lazyRadius values
      this.chainLength = this.props.brushRadius * window.devicePixelRatio
      this.lazy.setRadius(this.props.brushRadius * window.devicePixelRatio)
    }

    if (prevProps.overlayImage !== this.props.overlayImage) {
      this.drawOverlayImage()
    }

    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      // Signal this.loop function that values changed
      this.valuesChanged = true
    }
  }

  componentWillUnmount = () => {
    this.canvasObserver.unobserve(this.canvasContainer)
  }

  drawImage = () => {
    if (this.props.image) {
      drawImageProp({ ctx: this.ctx.grid, img: this.props.image })
    }
  }

  drawOverlayImage = () => {
    if (this.props.overlayImage) {
      drawImageProp({ ctx: this.ctx.drawing, img: this.props.overlayImage })
    }
  }

  undo = () => {
    const lines = this.lines.slice(0, -1)
    this.clearCanvas()
    this.drawOverlayImage()
    this.drawLines({ lines })
  }

  getSerializedData = () => {
    return JSON.stringify({
      lines: this.lines,
      width: this.prevWidth,
      height: this.prevHeight,
    })
  }

  getBlob = async (mimeType = 'image/png') => {
    return new Promise((resolve, reject) => {
      try {
        this.canvas.drawing.toBlob((blob) => {
          resolve(blob)
        }, mimeType)
      } catch (err) {
        reject(err)
      }
    })
  }

  loadSerializedData = (serializedData) => {
    if (typeof serializedData !== 'string') {
      throw new Error('saveData needs to be of type string!')
    }

    const { lines, width, height } = JSON.parse(serializedData)

    if (!Array.isArray(lines)) {
      throw new Error('lines needs to be an array!')
    }

    this.clearCanvas()
    this.drawOverlayImage()

    if (
      width === this.props.canvasWidth &&
      height === this.props.canvasHeight
    ) {
      this.drawLines({ lines })
      return
    }

    // we need to rescale the lines based on saved & current dimensions
    const scaleX = this.props.canvasWidth / width
    const scaleY = this.props.canvasHeight / height
    const scaleAvg = (scaleX + scaleY) / 2

    const scaledLines = lines.map((line) => ({
      ...line,
      points: line.points.map((p) => ({ x: p.x * scaleX, y: p.y * scaleY })),
      brushRadius: line.brushRadius * scaleAvg,
    }))

    this.drawLines({ lines: scaledLines })
  }

  drawLines = ({ lines }) => {
    for (const line of lines) {
      const { points, brushColor, brushRadius } = line

      // Draw the points
      this.drawPoints({ points, brushColor, brushRadius })

      // Save line with the drawn points
      this.points = points

      this.saveLine({ brushColor, brushRadius })
    }
  }

  handleDrawStart = (e) => {
    e.preventDefault()

    // Start drawing
    this.isPressing = true

    const { x, y } = this.getPointerPos(e)

    if (e.touches && e.touches.length > 0) {
      // on touch, set catenary position to touch pos
      this.lazy.update({ x, y }, { both: true })
    }

    // Ensure the initial down position gets added to our line
    this.handlePointerMove(x, y)
  }

  handleDrawMove = (e) => {
    e.preventDefault()

    const { x, y } = this.getPointerPos(e)
    this.handlePointerMove(x, y)
  }

  handleDrawEnd = (e) => {
    e.preventDefault()

    // Draw to this end pos
    this.handleDrawMove(e)

    // Stop drawing & save the drawn line
    this.isDrawing = false
    this.isPressing = false
    this.saveLine()
  }

  handleCanvasResize = (entries) => {
    const saveData = this.getSerializedData()

    for (const entry of entries) {
      const { width, height } = entry.contentRect

      setCanvasSize(this.canvas.interface, width, height)
      setCanvasSize(this.canvas.drawing, width, height)
      setCanvasSize(this.canvas.temp, width, height)
      setCanvasSize(this.canvas.grid, width, height)

      this.drawGrid(this.ctx.grid)
      this.drawImage()
      this.loop({ once: true })
    }

    this.loadSerializedData(saveData)

    this.prevHeight = this.props.canvasHeight
    this.prevWidth = this.props.canvasWidth
  }

  getPointerPos = (e) => {
    const rect = this.canvas.interface.getBoundingClientRect()

    // use cursor pos as default
    let clientX = e.clientX
    let clientY = e.clientY

    // use first touch if available
    if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX
      clientY = e.changedTouches[0].clientY
    }

    // return mouse/touch position inside canvas
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  handlePointerMove = (x, y) => {
    if (this.props.isDisabled) {
      return
    }

    this.lazy.update({ x, y })
    const isDisabled = !this.lazy.isEnabled()

    if (
      (this.isPressing && !this.isDrawing) ||
      (isDisabled && this.isPressing)
    ) {
      // Start drawing and add point
      this.isDrawing = true
      this.points.push(this.lazy.brush.toObject())
    }

    if (this.isDrawing) {
      // Add new point
      this.points.push(this.lazy.brush.toObject())

      // Draw current points
      this.drawPoints({
        points: this.points,
        brushColor: this.props.brushColor,
        brushRadius: this.props.brushRadius,
      })
    }

    this.mouseHasMoved = true
  }

  drawPoints = ({ points, brushColor, brushRadius }) => {
    this.ctx.temp.lineJoin = 'round'
    this.ctx.temp.lineCap = 'round'
    this.ctx.temp.strokeStyle = brushColor

    this.ctx.temp.clearRect(
      0,
      0,
      this.ctx.temp.canvas.width,
      this.ctx.temp.canvas.height
    )
    this.ctx.temp.lineWidth = brushRadius * 2

    let p1 = points[0]
    let p2 = points[1]

    this.ctx.temp.moveTo(p2.x, p2.y)
    this.ctx.temp.beginPath()

    for (var i = 1, len = points.length; i < len; i++) {
      // we pick the point between pi+1 & pi+2 as the
      // end point and p1 as our control point
      var midPoint = midPointBtw(p1, p2)
      this.ctx.temp.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y)
      p1 = points[i]
      p2 = points[i + 1]
    }
    // Draw last line as a straight line while
    // we wait for the next point to be able to calculate
    // the bezier control point
    this.ctx.temp.lineTo(p1.x, p1.y)
    this.ctx.temp.stroke()
  }

  saveLine = ({ brushColor, brushRadius } = {}) => {
    if (this.points.length < 2) return

    // Save as new line
    this.lines.push({
      points: [...this.points],
      brushColor: brushColor || this.props.brushColor,
      brushRadius: brushRadius || this.props.brushRadius,
    })

    // Reset points array
    this.points.length = 0

    const width = this.canvas.temp.width
    const height = this.canvas.temp.height

    // Copy the line to the drawing canvas
    this.ctx.drawing.drawImage(this.canvas.temp, 0, 0, width, height)

    // Clear the temporary line-drawing canvas
    this.ctx.temp.clearRect(0, 0, width, height)
  }

  clearCanvas = () => {
    this.lines = []
    this.valuesChanged = true
    this.ctx.drawing.clearRect(
      0,
      0,
      this.canvas.drawing.width,
      this.canvas.drawing.height
    )
    this.ctx.temp.clearRect(
      0,
      0,
      this.canvas.temp.width,
      this.canvas.temp.height
    )
  }

  loop = ({ once = false } = {}) => {
    if (this.mouseHasMoved || this.valuesChanged) {
      const pointer = this.lazy.getPointerCoordinates()
      const brush = this.lazy.getBrushCoordinates()

      this.drawInterface(this.ctx.interface, pointer, brush)
      this.mouseHasMoved = false
      this.valuesChanged = false
    }

    if (!once) {
      window.requestAnimationFrame(() => {
        this.loop()
      })
    }
  }

  drawGrid = (ctx) => {
    if (this.props.hideGrid) {
      return
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.beginPath()
    ctx.setLineDash([5, 1])
    ctx.setLineDash([])
    ctx.strokeStyle = this.props.gridColor
    ctx.lineWidth = 0.5

    const gridSize = 25

    let countX = 0
    while (countX < ctx.canvas.width) {
      countX += gridSize
      ctx.moveTo(countX, 0)
      ctx.lineTo(countX, ctx.canvas.height)
    }
    ctx.stroke()

    let countY = 0
    while (countY < ctx.canvas.height) {
      countY += gridSize
      ctx.moveTo(0, countY)
      ctx.lineTo(ctx.canvas.width, countY)
    }
    ctx.stroke()
  }

  drawInterface = (ctx, pointer, brush) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Draw brush preview
    ctx.beginPath()
    ctx.fillStyle = this.props.brushColor
    ctx.arc(brush.x, brush.y, this.props.brushRadius, 0, Math.PI * 2, true)
    ctx.fill()

    // Draw mouse point (the one directly at the cursor)
    ctx.beginPath()
    ctx.fillStyle = this.props.catenaryColor
    ctx.arc(pointer.x, pointer.y, 4, 0, Math.PI * 2, true)
    ctx.fill()

    // Draw catenary
    if (this.lazy.isEnabled()) {
      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.setLineDash([2, 4])
      ctx.strokeStyle = this.props.catenaryColor
      this.catenary.drawToCanvas(
        this.ctx.interface,
        brush,
        pointer,
        this.chainLength
      )
      ctx.stroke()
    }

    // Draw brush point (the one in the middle of the brush preview)
    ctx.beginPath()
    ctx.fillStyle = this.props.catenaryColor
    ctx.arc(brush.x, brush.y, 2, 0, Math.PI * 2, true)
    ctx.fill()
  }

  render() {
    return (
      <div
        ref={(container) => {
          this.canvasContainer = container
        }}
        style={{
          display: 'block',
          touchAction: this.props.isDisabled ? 'auto' : 'none',
          width: this.props.canvasWidth,
          height: this.props.canvasHeight,
        }}
      >
        {canvasTypes.map(({ name, zIndex }) => {
          const isInterface = name === 'interface'

          return (
            <canvas
              key={name}
              ref={(canvas) => {
                if (canvas) {
                  this.canvas[name] = canvas
                  this.ctx[name] = canvas.getContext('2d')
                }
              }}
              style={{ ...canvasStyle, zIndex }}
              onMouseDown={isInterface ? this.handleDrawStart : undefined}
              onMouseMove={isInterface ? this.handleDrawMove : undefined}
              onMouseUp={isInterface ? this.handleDrawEnd : undefined}
              onMouseOut={isInterface ? this.handleDrawEnd : undefined}
              onTouchStart={isInterface ? this.handleDrawStart : undefined}
              onTouchMove={isInterface ? this.handleDrawMove : undefined}
              onTouchEnd={isInterface ? this.handleDrawEnd : undefined}
              onTouchCancel={isInterface ? this.handleDrawEnd : undefined}
            />
          )
        })}
      </div>
    )
  }
}
