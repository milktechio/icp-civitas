import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import User "User";
import SHM "libs/FunctionalStableHashMap";

/****modificaciones*****/
// Se sustituyo el contrato para almacentar solo el Principal
// de cada usuario, el privilegio de votar estara detercminado por su balance
//se convirtieron en clases las cuales tendran como contratoc entral main.mo
//Se añadieron funciones que modifican el balance

class Whitelist(whitelist : SHM.StableHashMap<Principal, User.User>) {
    //HashMap para almacenar la whitelist
    //Funcion para añadir usuarios a la whitelist
    public func addUser(id: Principal) : Bool{
        let findUser = isWhitelisted(id);
        if(findUser == false){
            let new_user : User.User = {id = id; var balance = 0;};
            SHM.put(whitelist, Principal.equal, Principal.hash, id, new_user);
            return true;
        };
        return false;
    };

    //Funcion para obtener el usuario
    public func getUser(id : Principal) : ?User.User{
        return SHM.get(whitelist,Principal.equal, Principal.hash, id);
    };
 
    //Funcion para eliminar usuarios de la whitelist
    public func deleteUser(user :  Principal) : Bool {
        let findUser = isWhitelisted(user);
        if(findUser == true){
            SHM.delete(whitelist, Principal.equal, Principal.hash, user);
            return true;
        };
        return false;
    };

    public func getWhiteList() : SHM.StableHashMap<Principal,User.User>{
        return whitelist;
    };

    /*public func hardSetwhitelist(new_hm : SHM.StableHashMap<Principal,User.User>){
        whitelist := new_hm;
    };*/

    //Funcion para buscar usuarios
    private func isWhitelisted(user: Principal) : Bool {
        let isUser = getUser(user);
        switch(isUser){
            case (?_){
                return true;
            };
            case (null){
                return false;
            };
        };
    };
    // DEBUG: Función para imprimir un hashmap completo
    public func printWhitelist() : Text {
        var result : Text = "";
        for ((user, _) in SHM.entries(whitelist)) {
            result := result # Principal.toText(user) # "\n";
        };
        return result;
    };

    /*/Discard
    //Funcion para eliminar privilegios de votacion
    public func rmVotingPr(user : Text) : async Bool {
        let findUser = await isWhitelisted(user);
        if(findUser == true){
            whitelist.put(user, false);
            return true;
        };
        return false;
    };
    */
};
