export default function createDrawing(
  canvas: HTMLCanvasElement | null,
  initialDrawing: string | null,
  saveDrawing: (drawing: string) => void,
): void {
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.strokeStyle = 'white'

  let drawing: [number, number, string][] = initialDrawing ? JSON.parse(initialDrawing) : []

  if (drawing.length) {
    drawing.forEach(([x, y, type]) => {
      ctx?.lineTo(x, y)
      if (type === 'end') {
        ctx?.stroke()
        ctx?.beginPath()
      }
    })
  }

  let isDrawing = false
  let points: Array<[number | null, number | null, string]> = []

  canvas.onmousedown = () => {
    isDrawing = true
    ctx?.beginPath()
  }

  canvas.onmousemove = (e: MouseEvent) => {
    if (!isDrawing) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ctx?.lineTo(x, y)
    ctx?.stroke()
    points.push([x, y, 'move'])
  }

  canvas.onmouseup = () => {
    if (!isDrawing) return
    isDrawing = false
    ctx?.stroke()
    ctx?.closePath()
    points.push([null, null, 'end'])
    saveDrawing(JSON.stringify(points))
    points = []
  }

  canvas.onmouseout = () => {
    if (isDrawing) {
      isDrawing = false
      ctx?.stroke()
      ctx?.closePath()
      points.push([null, null, 'end'])
      saveDrawing(JSON.stringify(points))
      points = []
    }
  }
}
