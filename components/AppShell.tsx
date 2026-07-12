// "use client";

// import { useAuth } from "@/lib/auth-context";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// import { auth } from "@/lib/firebase";
// import { addGoal } from "@/services/goalService";
// import { signOut } from "firebase/auth";

// import { Button } from "@/components/ui/button";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { toast } from "sonner";

// import {
//   Menu,
//   Plus,
//   Home,
//   Target,
//   LogOut,
// } from "lucide-react";

// import { CreateGoalDialog } from "@/components/goal/CreateGoalDialog";


// export default function AppShell({
//   children,
// }: {
//   children: React.ReactNode;
// }) {

//   const { user, loading } = useAuth();

//   const router = useRouter();

//   const [goalOpen, setGoalOpen] = useState(false);


//   useEffect(() => {

//     if (!loading && !user) {
//       router.replace("/");
//     }

//   }, [user, loading, router]);



//   if (loading) return null;



//   const logout = async () => {

//     try {

//       await signOut(auth);

//       toast.success("Logged out");

//       router.replace("/");

//     } catch {

//       toast.error("Logout failed");

//     }

//   };



//   const createGoal = async (
//     title:string,
//     description?:string
//   ) => {

//     const user = auth.currentUser;


//     if (!user) {
//       throw new Error("Not authenticated");
//     }


//     await addGoal(
//       user.uid,
//       {
//         title,
//         description,
//         status:"active",
//         progress:0,
//       }
//     );


//     // refresh GoalList
//     window.dispatchEvent(
//       new Event("goal-created")
//     );

//   };

// useEffect(() => {

//   const refresh = () => {
//     loadGoals();
//   };


//   window.addEventListener(
//     "goal-created",
//     refresh
//   );


//   return () => {
//     window.removeEventListener(
//       "goal-created",
//       refresh
//     );
//   };

// }, []);

//   return (

//     <>

//       <div className="min-h-screen flex flex-col">


//         <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-3">


//           <div className="text-xs tracking-[0.35em] font-semibold text-muted-foreground">
//             PARTH
//           </div>



//           <DropdownMenu>


//             <DropdownMenuTrigger asChild>

//               <Button
//                 size="icon"
//                 variant="outline"
//                 className="rounded-full h-11 w-11"
//               >

//                 <Menu className="h-5 w-5"/>

//               </Button>

//             </DropdownMenuTrigger>



//             <DropdownMenuContent
//               align="end"
//               className="w-56"
//             >


//               <DropdownMenuItem
//                 onClick={() => setGoalOpen(true)}
//               >

//                 <Plus className="mr-2 h-4 w-4"/>

//                 New Goal

//               </DropdownMenuItem>



//               <DropdownMenuSeparator />



//               <DropdownMenuItem
//                 onClick={() => router.push("/dashboard")}
//               >

//                 <Home className="mr-2 h-4 w-4"/>

//                 Dashboard

//               </DropdownMenuItem>



//               <DropdownMenuItem
//                 onClick={() => router.push("/goals")}
//               >

//                 <Target className="mr-2 h-4 w-4"/>

//                 Goals

//               </DropdownMenuItem>



//               <DropdownMenuSeparator />



//               <DropdownMenuItem
//                 className="text-red-500"
//                 onClick={logout}
//               >

//                 <LogOut className="mr-2 h-4 w-4"/>

//                 Logout

//               </DropdownMenuItem>


//             </DropdownMenuContent>


//           </DropdownMenu>


//         </header>



//         <main className="flex-1">

//           {children}

//         </main>


//       </div>



//       <CreateGoalDialog

//         isOpen={goalOpen}

//         onClose={() => setGoalOpen(false)}

//         onCreate={createGoal}

//       />


//     </>

//   );
// }



"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { auth } from "@/lib/firebase";
import { addGoal } from "@/services/goalService";
import { signOut } from "firebase/auth";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";
import { Menu, Plus, Home, Target, LogOut, Loader2 } from "lucide-react";

import { CreateGoalDialog } from "@/components/goal/CreateGoalDialog";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [goalOpen, setGoalOpen] = useState(false);

  // Auth redirect
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // Goal created listener
  useEffect(() => {
    const refresh = () => console.log("✅ Goal created event received");
    window.addEventListener("goal-created", refresh);
    return () => window.removeEventListener("goal-created", refresh);
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.replace("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

 const createGoal = async(
 title:string,
 description?:string
)=>{

 await addGoal({
   title,
   description,
   status:"active",
   progress:0
 });


 window.dispatchEvent(
   new Event("goal-created")
 );

};

  // Show loading state properly
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in after loading, don't render the shell
  if (!user) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-3 border-b bg-background">
          <div className="text-xs tracking-[0.35em] font-semibold text-muted-foreground">
            PARTH
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full h-11 w-11"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setGoalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Goal
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => router.push("/goals")}>
                <Target className="mr-2 h-4 w-4" />
                Goals
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      <CreateGoalDialog
        isOpen={goalOpen}
        onClose={() => setGoalOpen(false)}
        onCreate={createGoal}
      />
    </>
  );
}