import { Button, useDisclosure } from "@chakra-ui/react";
import CreateAd from "../../components/ad/CreateAd";
import { useCallback, useEffect } from "react";
import { IAd } from "../../models/IAd";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { getAllAds } from "../../store/slices/ad-slice";
import adService from "../../services/ad-service";

const adsProp: IAd[] = [];
const setAdsProp = () => {};

interface AddAdProps {
    fetchAds: () => void;
}

export const AddAd = (props: AddAdProps) => {
    const { ads, loading } = useAppSelector((state) => state.ad);
    const dispatch = useAppDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const showModal = !loading && isOpen && ads.length;

    const fetchAds = useCallback(async () => {
        if (isOpen) {
            dispatch(getAllAds());
        }
    }, [isOpen, dispatch]);

    const handleSubmit = useCallback(
        async (newAd: IAd) => {
            await adService.create(newAd);
            onClose();
            props.fetchAds();
        },
        [props, onClose]
    );

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    return (
        <>
            <Button size="sm" colorScheme="green" onClick={onOpen}>
                Добавить
            </Button>
            {showModal && (
                <CreateAd
                    onClose={onClose}
                    ads={adsProp}
                    setAds={setAdsProp}
                    onSubmit={handleSubmit}
                />
            )}
        </>
    );
};
