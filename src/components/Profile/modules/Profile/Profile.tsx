import ProfileCard from "../../../UserProfile/modules/ProfileCard";
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useUserService } from "../../../../services/userService";

export default function Profile() {
    const { username } = useAuthContext();
    const { getUser } = useUserService()
    const { user } = getUser(username);

    return (
        <ProfileCard isAuthenticated={true} user={user} />
    )
}