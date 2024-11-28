import Principal "mo:base/Principal";
import SHM "libs/FunctionalStableHashMap";
import SB "libs/StableBuffer";
import Text "mo:base/Text";
import Poll "polls";
import Whitelist "whitelist";
import User "User";
import Polls "polls";
actor Main {
   /*****TODO LO STABLE VA ACA*******/
   stable let whitelist = SHM.init<Principal,User.User>();
   stable let polls = SB.init<Poll.Poll>();

   let owner : Principal = Principal.fromText("icbe6-fncid-t7cy2-wyqgx-w2jhu-3wgpt-x3n5x-5rhtj-czgbg-latkm-mae");
  
   let whitelistOps = Whitelist.Whitelist(whitelist);
   let pollOps = Poll.PollOps(polls);

   public query func say(phrase : Text) : async Text {
      return phrase;
   };

   //Obtinene usuario por id
   public query func getUserBy(id : Text) : async User.SharedUser {
      return whitelistOps.getUserById(Principal.fromText(id));
   };
   
   //Obtener todas las encuestas
   public query func getPolls() : async Polls.SharedBuffer{
      return pollOps.getAllPolls();
   };

   //Obtener enuesta por id
   public query func getPollById(id : Nat): async Polls.SharedPoll{
      return pollOps.getPollById(id);
   };

   /**********************CALLER**************************/

   //esta funcion de de alta a quien la llame
   public func register(principal : Text) : async User.SharedUser {
      return whitelistOps.addUser(Principal.fromText(principal)); //false s ya existe
   };

   //esta funcion elimina a quien la llame
   public shared (msg) func removeUser() : async User.SharedUser {
      return whitelistOps.deleteUser(msg.caller);
   };

   //resgtra 1 voto por id opcion, ahora el voto no es anonimo
   public shared (msg) func addVoteToPoll(idPoll : Nat, idOption : Nat, idUser: Text) : async Polls.SharedPoll{
      return pollOps.addVoteFor(idPoll,idOption,idUser);
   };

   /**********************OWNER****************************/
   // Agrega un conjunto de opciones a una votación
   public shared (msg) func createPoll(voteName : Text, optionNames : [Text]) : async Polls.SharedPoll {
      if (owner == owner) {
         return pollOps.createPoll(voteName, optionNames);
      };
       return {
         id = 100000;
         name = "--";
         options = [];
         votes = [];
         status = "Error: NO TIENES PERMISO";
      };
   };

   public  func removePoll(id : Nat) : async ?Polls.SharedPoll{
      return ?pollOps.removePoll(id);
   };

    public shared (msg) func renamePoll(id : Nat, new_name : Text) : async ?Polls.SharedPoll{
      if(msg.caller == owner){
         return ?pollOps.renamePoll(id,new_name);
      };
      return null;
   };

   public shared (msg) func addOptiontoPoll(id : Nat, new_option : Text) : async ?Polls.SharedPoll{
     if(msg.caller == owner){
         return ?pollOps.addOptionToPoll(id,new_option);
      };
      return null; 
   };

   public shared (msg) func removeOptionToPoll(id : Nat, id_remove : Nat) : async ?Polls.SharedPoll{
      if(msg.caller == owner){
         return ?pollOps.removeOptionToPoll(id,id_remove);
      };
      return null;  
   }
   
};
