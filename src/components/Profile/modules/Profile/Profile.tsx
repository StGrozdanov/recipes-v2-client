import ProfileCard from "../../../UserProfile/modules/ProfileCard";
import { useAuthContext } from '../../../../hooks/useAuthContext';
import * as userService from '../../../../services/userService';

export default function Profile() {
    const { username } = useAuthContext();
    const { user } = userService.getUser(username);
    
    return (
        <ProfileCard isAuthenticated={true} user={user} />
    )
}