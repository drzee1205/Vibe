import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SettingsForm } from "@/modules/settings/ui/settings-form";

const Page = async () => {
  const qc = getQueryClient();
  void qc.prefetchQuery(trpc.settings.get.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Keys</h1>
        <SettingsForm />
      </div>
    </HydrationBoundary>
  );
};

export default Page;