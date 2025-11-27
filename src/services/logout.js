import { PERSIST_STORE_NAME } from "../constants/constants"
export const logout=()=>{
  localStorage.removeItem(PERSIST_STORE_NAME)
}