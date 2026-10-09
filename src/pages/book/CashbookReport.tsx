import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { Button } from "../../components/ui/button";
import instance from "../../instance";

interface ReportEntry {
  amount: number;
  balanceAfter: number;
  categoryName: string | null;
  createdAtDate: string;
  createdAtTime: string;
  createdBy: string;
  entryType: number;
  id: string;
  name: string;
  paymentMethodName: string | null;
}

interface ReportGroup {
  entries?: ReportEntry[];
  groupDate: string;
}

interface CashbookReportData {
  groupedEntries?: ReportGroup[];
  id: string;
  name: string;
  netBalance: number;
  totalEntries: number;
  totalIn: number;
  totalOut: number;
}

const formatAmount = (amount: number) =>
  new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

const CashbookReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cashbook, setCashbook] = useState<CashbookReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let isActive = true;

    const loadReport = async () => {
      if (!id) {
        setErrorMessage("Cashbook was not found.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await instance.get<CashbookReportData>(`/api/cashbook/${id}`);
        if (isActive) setCashbook(response.data);
      } catch (error: unknown) {
        console.error("Failed to load cashbook report:", error);
        if (isActive) setErrorMessage("Unable to load this cashbook report.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadReport();
    return () => {
      isActive = false;
    };
  }, [id]);

  const entries = cashbook?.groupedEntries?.flatMap((group) =>
    (group.entries ?? []).map((entry) => ({ ...entry, groupDate: group.groupDate })),
  ) ?? [];

  const downloadPdf = async () => {
    if (!cashbook) return;

    setIsDownloading(true);
    try {
      const reportElement = reportRef.current;
      if (!reportElement) {
        throw new Error("The report content is not available.");
      }

      await document.fonts.ready;
      const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);
      const canvas = await html2canvas(reportElement, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: Math.max(window.innerWidth, 1100),
        onclone: (clonedDocument) => {
          clonedDocument
            .querySelectorAll('style, link[rel="stylesheet"]')
            .forEach((stylesheet) => stylesheet.remove());

          const reportStyles = clonedDocument.createElement("style");
          reportStyles.textContent = `
            [data-report-content] {
              box-sizing: border-box;
              width: 1024px;
              max-width: 1024px;
              margin: 0;
              padding: 32px;
              background: #ffffff;
              color: #1f2937;
              font-family: Arial, "Segoe UI", Tahoma, sans-serif;
              direction: ltr;
            }
            [data-report-content] * {
              box-sizing: border-box;
              color: #334155;
              background-color: transparent;
              border-color: #e2e8f0;
              box-shadow: none;
              outline-color: transparent;
              text-shadow: none;
            }
            [data-report-content] > section { margin-bottom: 24px; }
            [data-report-content] > section:first-child {
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 20px;
            }
            [data-report-content] h2 {
              margin: 4px 0;
              color: #111827;
              font-size: 28px;
              font-weight: 700;
            }
            [data-report-content] h3 {
              margin-bottom: 12px;
              color: #1f2937;
              font-size: 20px;
              font-weight: 600;
            }
            [data-report-content] p { margin: 4px 0; }
            [data-report-content] > section:nth-child(2) {
              display: flex;
              gap: 12px;
            }
            [data-report-content] > section:nth-child(2) > div {
              flex: 1;
              min-height: 66px;
              padding: 12px;
              border-radius: 6px;
              background: #f8fafc;
            }
            [data-report-content] > section:nth-child(2) > div:nth-child(2) { background: #f0fdf4; }
            [data-report-content] > section:nth-child(2) > div:nth-child(3) { background: #fef2f2; }
            [data-report-content] > section:nth-child(2) > div:nth-child(4) { background: #fffbeb; }
            [data-report-content] [dir="auto"] { unicode-bidi: plaintext; }
            [data-report-table] { overflow: visible; }
            [data-report-content] table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
              text-align: left;
            }
            [data-report-content] thead { background: #f8fafc; }
            [data-report-content] th {
              padding: 10px 8px;
              background: #f8fafc;
              color: #64748b;
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
            }
            [data-report-content] td {
              padding: 10px 8px;
              border-top: 1px solid #e2e8f0;
              vertical-align: top;
            }
            [data-report-content] tr:nth-child(even) td { background: #f8fafc; }
            [data-report-content] td:nth-last-child(-n+2) { text-align: right; }
          `;
          clonedDocument.head.appendChild(reportStyles);

          const clonedReport = clonedDocument.querySelector<HTMLElement>("[data-report-content]");
          if (clonedReport) {
            const tableContainer = clonedReport.querySelector<HTMLElement>("[data-report-table]");
            if (tableContainer) tableContainer.style.overflow = "visible";
          }
        },
      });
      const pdfDocument = new jsPDF({ orientation: "landscape", format: "a4" });
      const pageWidth = pdfDocument.internal.pageSize.getWidth();
      const pageHeight = pdfDocument.internal.pageSize.getHeight();
      const margin = 10;
      const imageWidth = pageWidth - margin * 2;
      const imageScale = imageWidth / canvas.width;
      const sliceHeight = Math.floor((pageHeight - margin * 2) / imageScale);

      const filename = cashbook.name
        .trim()
        .replace(/[<>:"/\\|?*]/g, "-")
        .replace(/\s+/g, "-") || "cashbook";
      for (let offsetY = 0, pageNumber = 0; offsetY < canvas.height; offsetY += sliceHeight) {
        if (pageNumber > 0) pdfDocument.addPage();

        const currentSliceHeight = Math.min(sliceHeight, canvas.height - offsetY);
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = currentSliceHeight;
        const context = pageCanvas.getContext("2d");
        if (!context) throw new Error("Unable to prepare a PDF page.");
        context.drawImage(
          canvas,
          0,
          offsetY,
          canvas.width,
          currentSliceHeight,
          0,
          0,
          canvas.width,
          currentSliceHeight,
        );

        pdfDocument.addImage(
          pageCanvas.toDataURL("image/png"),
          "PNG",
          margin,
          margin,
          imageWidth,
          currentSliceHeight * imageScale,
        );
        pdfDocument.setFontSize(8);
        pdfDocument.setTextColor(100);
        pdfDocument.text(
          `Page ${pageNumber + 1}`,
          pageWidth - margin,
          pageHeight - 5,
          { align: "right" },
        );
        pageNumber += 1;
      }

      pdfDocument.save(`${filename}-report.pdf`);
    } catch (error: unknown) {
      console.error("Failed to generate cashbook PDF:", error);
      setErrorMessage("Unable to generate the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex h-dvh items-center justify-center">
        <Loader />
      </main>
    );
  }

  if (errorMessage && !cashbook) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <p role="alert" className="text-gray-700">{errorMessage}</p>
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Back to cashbook
        </Button>
      </main>
    );
  }

  if (!cashbook) return null;

  return (
    <main className="min-h-screen bg-gray-50 pb-8">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" aria-label="Back to cashbook" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="truncate font-semibold text-gray-800">Cashbook report</h1>
        </div>
        <Button type="button" onClick={downloadPdf} disabled={isDownloading}>
          <Download className="h-4 w-4" />
          {isDownloading ? "Preparing PDF..." : "Download PDF"}
        </Button>
      </header>

      <article
        ref={reportRef}
        data-report-content
        className="mx-auto my-6 max-w-5xl space-y-6 rounded-lg bg-white p-5 shadow-sm sm:p-8"
        style={{ fontFamily: 'Arial, "Segoe UI", Tahoma, sans-serif' }}
      >
        <section className="border-b pb-5">
          <p className="text-sm text-gray-500">Cashbook report</p>
          <h2 dir="auto" className="mt-1 text-2xl font-bold text-gray-900">{cashbook.name}</h2>
          <p className="mt-2 text-sm text-gray-500">
            Generated on {format(new Date(), "dd MMM yyyy, HH:mm")}
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Total entries</p>
            <p className="mt-1 font-semibold text-gray-900">{cashbook.totalEntries}</p>
          </div>
          <div className="rounded-md bg-green-50 p-3">
            <p className="text-xs text-gray-500">Total in</p>
            <p className="mt-1 font-semibold text-green-700">{formatAmount(cashbook.totalIn)}</p>
          </div>
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-xs text-gray-500">Total out</p>
            <p className="mt-1 font-semibold text-red-700">{formatAmount(cashbook.totalOut)}</p>
          </div>
          <div className="rounded-md bg-amber-50 p-3">
            <p className="text-xs text-gray-500">Net balance</p>
            <p className="mt-1 font-semibold text-gray-900">{formatAmount(cashbook.netBalance)}</p>
          </div>
        </section>

        {errorMessage && (
          <p role="alert" className="text-sm text-red-700">{errorMessage}</p>
        )}

        <section>
          <h3 className="mb-3 text-lg font-semibold text-gray-800">Entries</h3>
          {entries.length === 0 ? (
            <p className="rounded-md bg-gray-50 p-5 text-center text-sm text-gray-500">
              This cashbook has no entries to export.
            </p>
          ) : (
            <div data-report-table className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                    <th className="p-3">Date</th>
                    <th className="p-3">Entry</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Payment method</th>
                    <th className="p-3 text-right">Amount</th>
                    <th className="p-3 text-right">Balance after</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b last:border-0">
                      <td className="whitespace-nowrap p-3 text-gray-600">
                        {entry.createdAtDate || entry.groupDate}
                        {entry.createdAtTime && <span className="block text-xs text-gray-400">{entry.createdAtTime}</span>}
                      </td>
                      <td dir="auto" className="max-w-48 p-3 font-medium text-gray-800">{entry.name}</td>
                      <td className={`whitespace-nowrap p-3 ${entry.entryType === 1 ? "text-green-700" : "text-red-700"}`}>
                        {entry.entryType === 1 ? "Cash in" : "Cash out"}
                      </td>
                      <td dir="auto" className="p-3 text-gray-600">{entry.categoryName || "-"}</td>
                      <td dir="auto" className="p-3 text-gray-600">{entry.paymentMethodName || "-"}</td>
                      <td className="whitespace-nowrap p-3 text-right font-medium text-gray-800">{formatAmount(entry.amount)}</td>
                      <td className="whitespace-nowrap p-3 text-right text-gray-600">{formatAmount(entry.balanceAfter)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </article>
    </main>
  );
};

export default CashbookReport;
