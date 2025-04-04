import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/data"
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Unauthourized() {
  const session = await getSession();
  // console.log(session);
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="flex flex-col">
        <p className="text-center text-red-400">
          Unauthorized Access !!
        </p>
        <Link href="/sign-in">
          <Button variant="outline" className="font-light">
            Please use your admin account to login !!
          </Button>
        </Link>
      </div>
    </main>
  )
}