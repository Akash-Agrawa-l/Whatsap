const initialState={
    User_Data:[],
}

export const profileReducer=(state=initialState,action:any)=>{
    const{type,payload}=action
    switch(type){
           case 'Set_Data':
               console.log('user',payload)
            return {...state,User_Data:payload}
       default: 
           return state
    }

}