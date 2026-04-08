import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const InvoiceMaker = () => {
    const location = useLocation()
    const [data, setData] = useState(location.state)

    useEffect(() => {
        console.log('location.state:', location.state)
        setData(location.state)
        console.log('data updated:', data)
    }, [location.state, data])

    const printInvoice = () => {
        const input = document.getElementById('invoice')
        html2canvas(input, { useCORS: true })
            .then((canvas) => {
                const imageData = canvas.toDataURL('image/png', 1.0)
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'pt',
                    format: [612, 792]
                })
                pdf.internal.scaleFactor = 1
                const imageProps = pdf.getImageProperties(imageData)
                const pdfWidth = pdf.internal.pageSize.getWidth()
                const pdfHeight = (imageProps.height * pdfWidth) / imageProps.width
                pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight)
                pdf.save('invoice_' + new Date().getTime() + '.pdf')
            })
    }

    if (!data || !data.product || !Array.isArray(data.product)) {
        return (
            <div style={{ padding: 40, textAlign: 'center', color: 'red', fontWeight: 'bold' }}>
                No invoice data found. Please go back and select a valid invoice.
            </div>
        );
    }

    return (
        <div>
            <div className='invoice-top-header'>
                <button onClick={printInvoice} className='print-btn'>
                    <i className="fa-solid fa-file-pdf"></i> Print
                </button>
            </div>
            <div id='invoice' className='invoice-wrapper'>
                <div className='invoice-header'>
                    <div className='company-detail'>
                        <h2 className='invoice-title'>INVOICE</h2>
                        <p><strong>From:</strong> {localStorage.getItem('companyName') || localStorage.getItem('email')}</p>
                    </div>
                    <div className='customer-detail'>
                        <p><strong>To:</strong> {data.to}</p>
                        <p><strong>Phone:</strong> {data.phone}</p>
                        <p><strong>Address:</strong> {data.address}</p>
                        <p><strong>Date:</strong> {data.date ? new Date(data.date).toLocaleDateString() : ''}</p>
                    </div>
                </div>
                <table className='product-table'>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.product.length > 0 ? (
                            data.product.map((product, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.qty}</td>
                                    <td>{product.qty * product.price}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ color: 'red', textAlign: 'center' }}>No products available for this invoice.</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan='4' style={{ textAlign: 'right', fontWeight: 'bold' }}>Grand Total</td>
                            <td style={{ fontWeight: 'bold' }}>Rs. {data.total}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

export default InvoiceMaker