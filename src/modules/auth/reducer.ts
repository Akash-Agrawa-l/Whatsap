const initialState={
    Auth_Data:[],
}

export const authReducer=(state=initialState,action:any)=>{
    const{type,payload}=action
    switch(type){
       case 'signIn':
           console.log('reducer payload',payload)
           return {...state,Auth_Data:payload}
       default: 
           return state
    }

}