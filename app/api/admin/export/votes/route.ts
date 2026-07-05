import { getVotesCsv } from "@/actions/export";

export async function GET() {
  const csv = await getVotesCsv();
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="votes.csv"',
    },
  });
}
