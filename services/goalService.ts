import { supabase } from "@/lib/supabase";


export async function addGoal(
  goal:{
    title:string;
    description?:string;
    status:string;
    progress:number;
  }
){

  const {
    data:{
      user
    }
  } = await supabase.auth.getUser();


  if(!user){
    throw new Error("Not authenticated");
  }


  const {data,error}=await supabase
    .from("goals")
    .insert({
      user_id:user.id,
      ...goal
    })
    .select()
    .single();


  if(error){
    throw error;
  }


  return data;
}



export async function getGoals(){

 const {
    data:{
      user
    }
 } = await supabase.auth.getUser();


 if(!user){
   return [];
 }


 const {data,error}=await supabase
 .from("goals")
 .select("*")
 .order(
   "created_at",
   {
    ascending:false
   }
 );


 if(error){
   throw error;
 }


 return data;

}




export async function updateGoal(
 id:string,
 updates:any
){

 const {error}=await supabase
 .from("goals")
 .update({
   ...updates,
   updated_at:new Date()
 })
 .eq("id",id);


 if(error){
  throw error;
 }

}




export async function deleteGoal(
 id:string
){

 const {error}=await supabase
 .from("goals")
 .delete()
 .eq("id",id);


 if(error){
  throw error;
 }

}