import Principal "mo:base/Principal";
import SHM "libs/FunctionalStableHashMap";
import SB "libs/StableBuffer";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Poll "polls";
import Whitelist "whitelist";
import User "User";
import Airdrop "Airdrop";
import Polls "polls";
actor Main {
   /*****TODO LO STABLE VA ACA*******/
   stable let whitelist = SHM.init<Principal,User.User>();
   stable let polls = SB.init<Poll.Poll>();
   stable var tokens_amount : Nat = 100000;

   let owner : Principal = Principal.fromText("otpyl-647cy-xr3ji-3bjmd-zs5h3-iu4so-jfu4b-cbjtl-bipcl-xdu7h-2ae");
  
   let whitelistOps = Whitelist.Whitelist(whitelist);
   let pollOps = Poll.PollOps(polls);
   let userOps = User.UserOps();
   let airdrop = Airdrop.Airdrop(userOps);

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

   //resgtra n votos por id opcion (el usuario no se guarda, voto sera anonimo)
   public shared (msg) func registerVote(idPoll : Nat, idOpt : Nat, amount : Nat) : async Polls.SharedPoll{
      switch (whitelistOps.getUser(msg.caller)) {
         case (?user) {
            userOps.removeBalance(user,amount);
            return pollOps.addVoteFor(idPoll, idOpt, amount);
         };
         case (null) {
            return {
               id = 100000;
               name = "--";
              options = [];
              votes = [];
              status = "Usuario no existe";
            };
         };
      };
   };

   /**********************OWNER****************************/
   // Agrega un conjunto de opciones a una votación
   public shared (msg) func addOptionToPoll(voteName : Text, optionNames : [Text]) : async Polls.SharedPoll {
      if (msg.caller == owner) {
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

   public shared (msg) func airDrop(amount : Nat) : async ?Whitelist.SharedWhiteList {
      if (msg.caller == owner) {
         let (res_tokens, success) = airdrop.airDrop(tokens_amount, amount, whitelistOps.getWhiteList());
         tokens_amount := res_tokens;
         if(success){
            return ?whitelistOps.getAllUsers();
         }else{
            return null
         }
      };
      return null;
   };
   
};