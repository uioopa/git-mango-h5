// PDF generation functionality

import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

export interface PDFOptions {
  filename?: string
  margin?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  pageSize?: string
}

const defaultOptions: PDFOptions = {
  filename: "cv.pdf",
  margin: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  },
  pageSize: "a4",
}

export async function generatePDF(element: HTMLElement, options: PDFOptions = {}): Promise<void> {
  const mergedOptions = { ...defaultOptions, ...options }

  // Create a new jsPDF instance
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: mergedOptions.pageSize,
  })

  // Get the width and height of the PDF
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()

  // Calculate the available width and height after applying margins
  const availableWidth = pdfWidth - mergedOptions.margin!.left - mergedOptions.margin!.right
  const availableHeight = pdfHeight - mergedOptions.margin!.top - mergedOptions.margin!.bottom

  try {
    // Convert the HTML element to a canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      allowTaint: true,
    })

    // Calculate the scale to fit the canvas within the available space
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    const scale = Math.min(availableWidth / canvasWidth, availableHeight / canvasHeight)

    // Calculate the dimensions of the scaled canvas
    const scaledWidth = canvasWidth * scale
    const scaledHeight = canvasHeight * scale

    // Calculate the position to center the canvas
    const x = mergedOptions.margin!.left + (availableWidth - scaledWidth) / 2
    const y = mergedOptions.margin!.top

    // Add the canvas to the PDF
    const imgData = canvas.toDataURL("image/png")
    pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight)

    // Save the PDF
    pdf.save(mergedOptions.filename)
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}

export async function generateMultiPagePDF(element: HTMLElement, options: PDFOptions = {}): Promise<void> {
  const mergedOptions = { ...defaultOptions, ...options }

  // Create a new jsPDF instance
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: mergedOptions.pageSize,
  })

  // Get the width and height of the PDF
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()

  // Calculate the available width and height after applying margins
  const availableWidth = pdfWidth - mergedOptions.margin!.left - mergedOptions.margin!.right

  try {
    // Convert the HTML element to a canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      allowTaint: true,
    })

    // Calculate the scale to fit the canvas width within the available space
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    const scale = availableWidth / canvasWidth

    // Calculate the dimensions of the scaled canvas
    const scaledWidth = canvasWidth * scale
    const scaledHeight = canvasHeight * scale

    // Calculate how many pages we need
    const pageCount = Math.ceil(scaledHeight / (pdfHeight - mergedOptions.margin!.top - mergedOptions.margin!.bottom))

    // Add each page to the PDF
    for (let i = 0; i < pageCount; i++) {
      if (i > 0) {
        pdf.addPage()
      }

      const srcY = (i * (pdfHeight - mergedOptions.margin!.top - mergedOptions.margin!.bottom)) / scale
      const srcHeight = (pdfHeight - mergedOptions.margin!.top - mergedOptions.margin!.bottom) / scale

      // Add the canvas to the PDF
      pdf.addImage(
        canvas,
        "PNG",
        mergedOptions.margin!.left,
        mergedOptions.margin!.top,
        scaledWidth,
        scaledHeight,
        "",
        "FAST",
        0,
        srcY,
        canvasWidth,
        srcHeight,
      )
    }

    // Save the PDF
    pdf.save(mergedOptions.filename)
  } catch (error) {
    console.error("Error generating multi-page PDF:", error)
    throw error
  }
}
