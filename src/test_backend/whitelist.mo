import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import User "User";
import SHM "libs/FunctionalStableHashMap";
import Buffer "mo:base/Buffer";
/****modificaciones*****/
// Se sustituyo el contrato para almacentar solo el Principal
// de cada usuario, el privilegio de votar estara detercminado por su balance
//se convirtieron en clases las cuales tendran como contratoc entral main.mo
//Se añadieron funciones que modifican el balance

type SharedWhiteList = {
    count : Nat;
    shwhitelist : [User.SharedUser];
};


class Whitelist(whitelist : SHM.StableHashMap<Principal, User.User>) {
    //HashMap para almacenar la whitelist
    //Funcion para añadir usuarios a la whitelist
    public func addUser(id: Principal) : User.SharedUser{
        let findUser = isWhitelisted(id);
        let new_user : User.User = {id = id; var balance = 0;};
        if(findUser == false){
            SHM.put(whitelist, Principal.equal, Principal.hash, id, new_user);
            return makeSharedUser(new_user, "Ok");
        };
        return makeSharedUser(new_user, "Error: Usuario ya existe");
    };
 
    //Funcion para eliminar usuarios de la whitelist
    public func deleteUser(user_id :  Principal) : User.SharedUser{
        let user = getUser(user_id);
        switch(user){
            case(?user){
                SHM.delete(whitelist, Principal.equal, Principal.hash, user_id);
                return makeSharedUser(user,"Ok");
            };
            case(null){
                return {
                    id = Principal.fromText("aaaaa-aa");
                    balance = 0;
                    status = "Error: Usuario no existe";
                };
            };
        };
    };

    //Obtener shared user
    public func getUserById(id : Principal): User.SharedUser{
        let user = getUser(id);
        switch(user){
            case(?user){
                return makeSharedUser(user,"Ok");
            };
            case(null){
                return {
                    id = Principal.fromText("aaaaa-aa");
                    balance = 0;
                    status = "Error: Usuario no existe";
                };
            };
        };
    };

    public func getAllUsers() : SharedWhiteList{
        let buffSh = Buffer.Buffer<User.SharedUser>(1);
        for(i in SHM.vals(whitelist)){
            buffSh.add(makeSharedUser(i,"Ok"));
        };
        let sharedBuffer = {
            count = SHM.size(whitelist);
            shwhitelist = Buffer.toArray(buffSh);
        };
        return sharedBuffer;
    };
    
    public func getWhiteList() : SHM.StableHashMap<Principal,User.User>{
        return whitelist;
    };

    //Funcion para obtener el usuario
    public func getUser(id : Principal) : ?User.User{
        return SHM.get(whitelist,Principal.equal, Principal.hash, id);
    };
    
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
    private func printWhitelist() : Text {
        var result : Text = "";
        for ((user, _) in SHM.entries(whitelist)) {
            result := result # Principal.toText(user) # "\n";
        };
        return result;
    };
    
    
    private func makeSharedUser(user: User.User, status : Text) : User.SharedUser{
        let sharedUser : User.SharedUser = {
            id = user.id;
            balance = user.balance;
            status = status;
        };
        return sharedUser;
    } 

};