import { useEffect, useRef } from 'react'

const GradientMesh = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let time = 0

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Gradient mesh animation
    const animate = () => {
      time += 0.005

      // Create gradient mesh effect
      const gradient1 = ctx.createRadialGradient(
        canvas.width * (0.5 + Math.sin(time) * 0.3),
        canvas.height * (0.5 + Math.cos(time) * 0.3),
        0,
        canvas.width * (0.5 + Math.sin(time) * 0.3),
        canvas.height * (0.5 + Math.cos(time) * 0.3),
        canvas.width * 0.8
      )
      gradient1.addColorStop(0, 'rgba(59, 130, 246, 0.15)') // blue-500
      gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)')

      const gradient2 = ctx.createRadialGradient(
        canvas.width * (0.5 + Math.cos(time * 0.8) * 0.3),
        canvas.height * (0.5 + Math.sin(time * 0.8) * 0.3),
        0,
        canvas.width * (0.5 + Math.cos(time * 0.8) * 0.3),
        canvas.height * (0.5 + Math.sin(time * 0.8) * 0.3),
        canvas.width * 0.8
      )
      gradient2.addColorStop(0, 'rgba(139, 92, 246, 0.15)') // violet-500
      gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)')

      const gradient3 = ctx.createRadialGradient(
        canvas.width * (0.5 + Math.sin(time * 1.2) * 0.3),
        canvas.height * (0.5 + Math.cos(time * 1.2) * 0.3),
        0,
        canvas.width * (0.5 + Math.sin(time * 1.2) * 0.3),
        canvas.height * (0.5 + Math.cos(time * 1.2) * 0.3),
        canvas.width * 0.8
      )
      gradient3.addColorStop(0, 'rgba(236, 72, 153, 0.1)') // pink-500
      gradient3.addColorStop(1, 'rgba(0, 0, 0, 0)')

      // Clear canvas
      ctx.fillStyle = 'rgba(9, 9, 11, 0.05)' // zinc-950 with opacity for trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw gradients
      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = gradient3
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}

export default GradientMesh
