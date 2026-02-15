import JournalEntryPageClient from "./JournalEntryPageClient";

export default function Page({ params }: { params: { id: string } }) {
  return <JournalEntryPageClient id={params.id} />;
}
