"use client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const formSchema = z.object({
  zaiApiKey: z.string().optional(),
  e2bApiKey: z.string().optional(),
});

export const SettingsForm = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.settings.get.queryOptions());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zaiApiKey: data?.zaiApiKey ?? "",
      e2bApiKey: data?.e2bApiKey ?? "",
    },
    values: {
      zaiApiKey: data?.zaiApiKey ?? "",
      e2bApiKey: data?.e2bApiKey ?? "",
    },
  });

  const mutation = useMutation(
    trpc.settings.setKeys.mutationOptions({
      onSuccess: () => toast.success("Saved"),
      onError: (e) => toast.error(e.message),
    })
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4")}>        
        <div>
          <label className="text-sm font-medium">Z.AI (GLM-4.5) API Key</label>
          <FormField
            control={form.control}
            name="zaiApiKey"
            render={({ field }) => (
              <Input {...field} type="password" placeholder="sk-..." />
            )}
          />
          <p className="text-xs text-muted-foreground mt-1">Used to call GLM-4.5 via OpenAI-compatible API.</p>
        </div>
        <div>
          <label className="text-sm font-medium">E2B Sandbox API Key</label>
          <FormField
            control={form.control}
            name="e2bApiKey"
            render={({ field }) => (
              <Input {...field} type="password" placeholder="e2b_..." />
            )}
          />
          <p className="text-xs text-muted-foreground mt-1">Used to create ephemeral sandboxes for previews.</p>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Form>
  );
};