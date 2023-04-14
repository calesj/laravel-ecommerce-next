import axios from "axios"

// esse metodo pega o token do localStorage, e faz uma requisicao pra API
// pra ver se e um token valido, se for, retorna true, senao retorna um erro
export const isAuthenticated = async () => {
    try {
        const token = localStorage.getItem('app-token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const response = await axios.get('http://127.0.0.1:8000/api/user')
        console.log('isAuthenticated', response.data)
        return true
    } catch (error) {
        console.log('isAuthenticated', error)
        return false
    }
}
