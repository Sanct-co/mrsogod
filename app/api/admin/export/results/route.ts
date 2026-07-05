import { getResultsCsv } from "@/actions/export";

export async function GET() {
  const csv = await getResultsCsv();
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="results.csv"',
    },
  });
}
