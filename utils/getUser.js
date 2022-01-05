async function getUser() {
  let user = localStorage.getItem('username')
  return user
}

module.exports = getUser