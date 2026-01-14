import GoogleSettings from "./GoogleSettings";
import YandexSettings from "./YandexSettings";

type ConversionSettingsProps = {
    projectId: number;
    mode: "google" | "yandex";
};

const ConversionSettings: React.FC<ConversionSettingsProps> = ({
    projectId,
    mode,
}) => {
    return (
        <>
            {mode === "google" ? (
                <GoogleSettings projectId={projectId} />
            ) : (
                <YandexSettings projectId={projectId} />
            )}
        </>
    );
};

export default ConversionSettings;
