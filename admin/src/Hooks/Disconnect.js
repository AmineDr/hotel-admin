import axios from "axios";

export default function disconnect() {
    axios.get('/api/disconnect');
}