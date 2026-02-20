import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Search, Eye, Download, MessageSquare, Mail, X, Flame, Printer } from 'lucide-react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import './Receipts.css'

export default function Receipts() {
  const [receipts, setReceipts] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [emailModal, setEmailModal] = useState(false)
  const receiptRef = useRef()

  useEffect(() => { fetchReceipts() }, [search])

  const fetchReceipts = async () => {
    try { const { data } = await axios.get('/api/receipts', { params: search ? { search } : {} }); setReceipts(data) }
    catch {}
  }

  const viewReceipt = async (id) => {
    try { const { data } = await axios.get(`/api/receipts/${id}`); setSelected(data) }
    catch {}
  }

  const downloadPDF = async () => {
    if (!receiptRef.current) return
    const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: '#ffffff' })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`${selected.receiptNo}.pdf`)
  }

  const openWhatsApp = () => {
    const msg = `Here is your payment receipt from ForgeEdu.\n\nReceipt No: ${selected.receiptNo}\nAmount: ₹${selected.amountPaid.toLocaleString('en-IN')}\nDate: ${new Date(selected.paymentDate).toLocaleDateString('en-IN')}\nBalance: ₹${selected.balanceRemaining.toLocaleString('en-IN')}\n\nThank you for choosing ForgeEdu!`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const formatCurrency = (n) => '₹' + (n || 0).toLocaleString('en-IN')

  return (
    <div className="receipts-page">
      <div className="page-header">
        <h1>Receipt <span className="text-gold">Generator</span></h1>
        <p className="text-muted">View, download, and share payment receipts</p>
      </div>

      {/* Search */}
      <div className="filter-bar">
        <Search size={16} className="text-muted" />
        <input className="form-input" placeholder="Search by student name or receipt number..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
        <span className="text-muted fs-sm">{receipts.length} receipts</span>
      </div>

      {/* Receipt List */}
      <div className="table-container">
        <table className="data-table">
          <thead><tr><th>Receipt #</th><th>Student</th><th>Course</th><th>Amount</th><th>Date</th><th>Mode</th><th>Action</th></tr></thead>
          <tbody>
            {receipts.map(r => (
              <tr key={r._id}>
                <td className="fw-600 text-gold">{r.receiptNo}</td>
                <td>{r.studentName}</td>
                <td>{r.course}</td>
                <td className="fw-600">{formatCurrency(r.amountPaid)}</td>
                <td className="text-muted fs-sm">{new Date(r.paymentDate).toLocaleDateString('en-IN')}</td>
                <td><span className="badge badge-info">{r.paymentMode}</span></td>
                <td><button className="btn-icon" onClick={() => viewReceipt(r._id)}><Eye size={16} /></button></td>
              </tr>
            ))}
            {receipts.length === 0 && <tr><td colSpan="7" className="text-center text-muted" style={{ padding: '40px' }}>No receipts found</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Receipt Preview Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="receipt-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Receipt Preview</h3>
              <button className="btn-icon" onClick={() => setSelected(null)}><X size={18} /></button>
            </div>

            {/* Printable Receipt */}
            <div className="receipt-preview" ref={receiptRef}>
              <div className="receipt-header-print">
                <div className="receipt-logo">🔥 ForgeEdu</div>
                <div className="receipt-inst-info">
                  <p>123 Education Lane, Kota, Rajasthan 324001</p>
                  <p>Phone: +91 99999 99999 | Email: info@forgeedu.in</p>
                </div>
                <h2 className="receipt-title-print">PAYMENT RECEIPT</h2>
              </div>

              <div className="receipt-meta">
                <div><strong>Receipt No:</strong> {selected.receiptNo}</div>
                <div><strong>Date:</strong> {new Date(selected.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>

              <div className="receipt-body">
                <div className="receipt-row"><span>Student Name</span><span>{selected.studentName}</span></div>
                <div className="receipt-row"><span>Course</span><span>{selected.course}</span></div>
                {selected.batch && <div className="receipt-row"><span>Batch</span><span>{selected.batch}</span></div>}
                <div className="receipt-row highlight"><span>Amount Paid</span><span>{formatCurrency(selected.amountPaid)}</span></div>
                <div className="receipt-row"><span>Amount in Words</span><span>{selected.amountInWords}</span></div>
                <div className="receipt-row"><span>Payment Mode</span><span>{selected.paymentMode}</span></div>
                <div className="receipt-row"><span>Balance Remaining</span><span>{formatCurrency(selected.balanceRemaining)}</span></div>
              </div>

              <div className="receipt-footer-print">
                <div className="receipt-stamp">
                  <p>For ForgeEdu</p>
                  <div className="receipt-sig-line" />
                  <p>Authorized Signature</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="receipt-actions">
              <button className="btn btn-primary" onClick={downloadPDF}><Download size={16} /> Download PDF</button>
              <button className="btn btn-secondary" onClick={openWhatsApp} style={{ background: '#25D366', color: '#fff', border: 'none' }}><MessageSquare size={16} /> Send via WhatsApp</button>
              <button className="btn btn-secondary" onClick={() => setEmailModal(true)}><Mail size={16} /> Send via Email</button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {emailModal && (
        <div className="modal-overlay" onClick={() => setEmailModal(false)} style={{ zIndex: 1100 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Send via Email</h3>
              <button className="btn-icon" onClick={() => setEmailModal(false)}><X size={18} /></button>
            </div>
            <div className="email-preview">
              <p><strong>To:</strong> parent@example.com</p>
              <p><strong>Subject:</strong> Payment Receipt - {selected?.receiptNo}</p>
              <div className="email-body-preview">
                <p>Dear Parent,</p>
                <p>Please find attached the payment receipt ({selected?.receiptNo}) for {formatCurrency(selected?.amountPaid)} towards {selected?.studentName}'s {selected?.course} fees.</p>
                <p>Balance remaining: {formatCurrency(selected?.balanceRemaining)}</p>
                <p>Thank you for choosing ForgeEdu.</p>
                <p>Warm Regards,<br />ForgeEdu Team</p>
              </div>
            </div>
            <button className="btn btn-primary w-full mt-md" onClick={() => { setEmailModal(false); alert('Email sent! (Demo)') }}>Send Email</button>
          </div>
        </div>
      )}
    </div>
  )
}
