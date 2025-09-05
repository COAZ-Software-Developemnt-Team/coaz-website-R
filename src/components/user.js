// src/components/User.js
import { getCurrentUser, loginUser } from '../services/userService';

const User = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadUser = async () => {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    };

    const onLogin = async () => {
        setLoading(true);
        const loggedInUser = await loginUser('admin', 'secret123');
        if (loggedInUser) {
            setUser(loggedInUser);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUser();
    }, []);

    // ... rest of your component ...
};