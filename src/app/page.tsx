"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const [value, setValue] = useState("");

  const trpc = useTRPC();
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: (data) => {
        router.push(`/projects/${data.id}`);
      },
    })
  );

  const trimmed = value.trim();
  const disabled = createProject.isPending || trimmed.length === 0;

  const submit = () => {
    if (trimmed.length === 0) {
      toast.error("Message is required");
      return;
    }
    createProject.mutate({ value: trimmed });
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe what you want to build"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <Button disabled={disabled} onClick={submit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Page;