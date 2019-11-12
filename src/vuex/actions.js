// 应用mutations
export const setRole = ({commit}, role) => {
  commit('userStatus', role)
}

export const setToken = ({commit}, token) => {
  commit('userToken', token)
}
