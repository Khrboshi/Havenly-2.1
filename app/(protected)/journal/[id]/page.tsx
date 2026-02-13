export const dynamic = "force-static";

import JournalEntryClient from "./JournalEntryClient";

export default function Page({
  params,
}: {
  params: { id: string };
}) {
  return <JournalEntryClient entry={{ id: params.id } as any} />;
}
