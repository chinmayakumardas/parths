// "use client";

// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import { 
//   ChevronsUpDownIcon, 
//   SparklesIcon, 
//   BadgeCheckIcon, 
//   CreditCardIcon, 
//   BellIcon, 
//   LogOutIcon 
// } from "lucide-react";
// import { auth } from "@/lib/firebase";
// import { signOut } from "firebase/auth";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// export function NavUser({
//   user,
// }: {
//   user: {
//     name: string;
//     email: string;
//     avatar: string;
//   };
// }) {
//   const { isMobile } = useSidebar();
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       toast.success("Logged out successfully");
//       router.push("/"); // or wherever your login page is
//     } catch (error) {
//       toast.error("Failed to log out");
//       console.error(error);
//     }
//   };

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger
//             render={
//               <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
//             }
//           >
//             <Avatar>
//               <AvatarImage src={user.avatar} alt={user.name} />
//               <AvatarFallback>CN</AvatarFallback>
//             </Avatar>
//             <div className="grid flex-1 text-left text-sm leading-tight">
//               <span className="truncate font-medium">{user.name}</span>
//               <span className="truncate text-xs">{user.email}</span>
//             </div>
//             <ChevronsUpDownIcon className="ml-auto size-4" />
//           </DropdownMenuTrigger>

//           <DropdownMenuContent
//             className="w-fit"
//             side={isMobile ? "bottom" : "right"}
//             align="end"
//             sideOffset={4}
//           >
//             <DropdownMenuGroup>
//               <DropdownMenuLabel className="p-0 font-normal">
//                 <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                   <Avatar>
//                     <AvatarImage src={user.avatar} alt={user.name} />
//                     <AvatarFallback>CN</AvatarFallback>
//                   </Avatar>
//                   <div className="grid flex-1 text-left text-sm leading-tight">
//                     <span className="truncate font-medium">{user.name}</span>
//                     <span className="truncate text-xs">{user.email}</span>
//                   </div>
//                 </div>
//               </DropdownMenuLabel>
//             </DropdownMenuGroup>

//             <DropdownMenuSeparator />

//             <DropdownMenuGroup>
//               <DropdownMenuItem>
//                 <SparklesIcon />
//                 Upgrade to Pro
//               </DropdownMenuItem>
//             </DropdownMenuGroup>

//             <DropdownMenuSeparator />

//             <DropdownMenuGroup>
//               <DropdownMenuItem>
//                 <BadgeCheckIcon />
//                 Account
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <CreditCardIcon />
//                 Billing
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <BellIcon />
//                 Notifications
//               </DropdownMenuItem>
//             </DropdownMenuGroup>

//             <DropdownMenuSeparator />

//             <DropdownMenuItem 
//               onClick={handleLogout}
//               className="text-red-600 focus:text-red-600 cursor-pointer"
//             >
//               <LogOutIcon />
//               Log out
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  ChevronsUpDownIcon, 
  SparklesIcon, 
  BadgeCheckIcon, 
  CreditCardIcon, 
  BellIcon, 
  LogOutIcon 
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to log out");
      console.error(error);
    }
  };

  // If still loading or no user, hide or show minimal fallback
  if (loading || !user) {
    return null;
  }

  const displayName = user.displayName || user.email?.split("@")[0] || "User";
  const email = user.email || "";
  const photoURL = user.photoURL || "";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={photoURL} alt={displayName} />
              <AvatarFallback>
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{displayName}</span>
              <span className="truncate text-xs text-muted-foreground">
                {email}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-fit"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={photoURL} alt={displayName} />
                    <AvatarFallback>
                      {displayName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{displayName}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SparklesIcon className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}