import {BrowserRouter, Route, Routes} from "react-router-dom"
import {Fragment} from "react"
import Login from "@/pages/login"

const Private = ({Item}) => {
    const signed = false
    return signed > 0 ? <Item /> : <Login></Login>
}
const RoutesApp = () => {
    return (
        <BrowserRouter>
            <Fragment>
                <Routes>
                    <Route exact path="/login" element={<Private Item={Login} />} />
                    <Route></Route>
                    <Route></Route>
                    <Route></Route>
                </Routes>
            </Fragment>
        </BrowserRouter>
    )
}

export default RoutesApp