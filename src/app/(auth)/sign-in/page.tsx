import SignInWithGoogle from "@/components/app/buttons/sign-in-with-google";
import { getSession } from "@/lib/data";
import { redirect } from "next/navigation";
export default async function SignInPage() {
  
  // const session = await getSession();

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md px-5">
        <SignInWithGoogle />
      </div>
    </div>
  );
}