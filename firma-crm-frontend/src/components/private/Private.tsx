import { useAppSelector } from "../../hooks/redux";
import { useRoles } from "../../hooks/useRoles";

type PrivateProps = {
    roles?: string[];
    children: JSX.Element;
};

const Private: React.FC<PrivateProps> = (props) => {
    const { auth } = useAppSelector((state) => state.auth);
    const { hasRoles } = useRoles();


    if (!auth) return null;

    if (props.roles && !hasRoles(props.roles)) return null;

    return props.children;
};

export default Private;
