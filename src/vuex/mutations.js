// 更改用户状态信息
export const userStatus = (state, role) => {
  if (role) {
    state.currentRole = role
    state.isLogin = true
  } else if (role == null) {
    // 退出登录的时候清空sessionStorage里的内容
    sessionStorage.setItem('role', null)
    sessionStorage.setItem('token', '')
    state.currentRole = null
    state.isLogin = false
    state.token = ''
  }
}

export const userToken = (state, token) => {
  if (token) {
    state.token = token
  } else {
    state.token = null
  }
}
