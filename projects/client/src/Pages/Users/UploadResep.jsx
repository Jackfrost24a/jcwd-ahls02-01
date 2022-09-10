import React, { useState, useEffect, useRef } from "react";
import Axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import AccorAddressComponent from "../../Components/Users/AccorAddress";
import NavbarComponent from "../../Components/Users/Navbar";
import TransactionList from "./TransactionList";
import { useToastHook } from "../../Components/CustomToast";
import {
    Box,
    Divider,
    VStack,
    Center,
    Stack,
    Image,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Select,
    Radio,
    RadioGroup,
    useMediaQuery,
    Input
} from "@chakra-ui/react";

import { ImLocation2 } from "react-icons/im";
import { MdDeliveryDining } from "react-icons/md";

const UploadResepPage = (props) => {

    // * untuk warnain dan atur size icon kembali ke keranjang saat di mobile phone display
    let iconStyles = { color: "var(--colorSix)", fontSize: "1.5em" };

    // * media query
    const [isSmallScreen] = useMediaQuery("(max-width: 768px)");

    // * assign function
    const [currentToast, newToast] = useToastHook();
    const navigate = useNavigate();
    //const dispatch = useDispatch();
    // const { state, search } = useLocation();

    //^ check state
    // console.log(`checkout pg-state dari page cart ${state}`);

    //^ STATE MANAGEMENT
    //TODO ❗❗❗ axios rajaongkir untuk ambil delivery method dan ongkirnya berdasarkan alamat pengiriman yang dipilih
    const [deliveryMethod, setDeliveryMethod] = useState({
        "jne": [
            {
                "service": "OKE",
                "description": "Ongkos Kirim Ekonomis",
                "cost": [
                    {
                        "value": 10000,
                        "etd": "2-3",
                        "note": ""
                    }
                ]
            },
            {
                "service": "REG",
                "description": "Layanan Reguler",
                "cost": [
                    {
                        "value": 11000,
                        "etd": "1-2",
                        "note": ""
                    }
                ]
            },
            {
                "service": "YES",
                "description": "Yakin Esok Sampai",
                "cost": [
                    {
                        "value": 24000,
                        "etd": "1-1",
                        "note": ""
                    }
                ]
            }
        ],
        "pos": [
            {
                "service": "Pos Reguler",
                "description": "Pos Reguler",
                "cost": [
                    {
                        "value": 11000,
                        "etd": "2 HARI",
                        "note": ""
                    }
                ]
            },
            {
                "service": "Pos Nextday",
                "description": "Pos Nextday",
                "cost": [
                    {
                        "value": 24000,
                        "etd": "1 HARI",
                        "note": ""
                    }
                ]
            }
        ],
        "tiki": [
            {
                "service": "ECO",
                "description": "Economy Service",
                "cost": [
                    {
                        "value": 12000,
                        "etd": "4",
                        "note": ""
                    }
                ]
            },
            {
                "service": "REG",
                "description": "Regular Service",
                "cost": [
                    {
                        "value": 14000,
                        "etd": "3",
                        "note": ""
                    }
                ]
            },
            {
                "service": "ONS",
                "description": "Over Night Service",
                "cost": [
                    {
                        "value": 28000,
                        "etd": "1",
                        "note": ""
                    }
                ]
            }
        ]
    })

    // const [subTotalAllCartItems, setSubTotalAllCartItems] = useState(0);
    const [idAddressForOngkir, setIdAddressForOngkir] = useState(null);
    const [addressForOngkir, setAddressForOngkir] = useState("");
    const [idProvinceForOngkir, setIdProvinceForOngkir] = useState(null);
    const [idCityForOngkir, setIdCityForOngkir] = useState(null);
    const [receiverNameForOngkir, setReceiverNameForOngkir] = useState("");
    const [receiverPhoneForOngkir, setReceiverPhoneForOngkir] = useState("");
    const [labelForOngkir, setLabelForOngkir] = useState("");
    const [ongkir, setOngkir] = useState(0);
    const [total, setTotal] = useState(0);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [isModalAddressOpen, setIsModalAddressOpen] = useState(false);
    const [isTambahAlamat, setIsTambahAlamat] = useState(0);
    const [isEditedAlamat, setIsEditedAlamat] = useState(null);
    const [radioDelivery, setRadioDelivery] = useState("jne");
    const [deliveryDropdownValue, setDeliveryDropdownValue] = useState("null");
    const [isUnggahResep, setIsUnggahResep] = useState(0);
    const [newImageResep, setNewImageResep] = useState(null);
    const inputIdImageRecipe = useRef(null);

    // & component did mount
    useEffect(() => {
        setIsUnggahResep(1);

        // fungsi untuk get ongkir rajaongkir via idProvince dan idCity dari AccorAddress

    }, [])

    // & untuk ambil alamat terpilih dari AccorAddressComponent
    const handleCallbackToChild = (idAddress, address, idProvince, idCity, receiverName, receiverPhone, label) => {
        setIdAddressForOngkir(idAddress);
        setAddressForOngkir(address);
        setIdProvinceForOngkir(idProvince);
        setIdCityForOngkir(idCity);
        setReceiverNameForOngkir(receiverName);
        setReceiverPhoneForOngkir(receiverPhone);
        setLabelForOngkir(label);
    }

    // & untuk ambil idAddress kalau ada alamat yg diedit
    const handleCallbackToChildEditedAddress = (idAddress) => {
        setIsEditedAlamat(idAddress);
    }

    // & untuk cancel proses tambah alamat baru
    const handleCallbackToChildNewAddress = () => {
        setIsTambahAlamat(0);
    }

    // & onClick btn tambah alamat akan kasih notif kalau ada alamat yg diedit belum disave atau alamat baru belum disave. Kalau 2 kondisi itu ga ditemukan akan setState tambah alamat jadi 1
    const btnTambahAlamat = () => {

        if (isEditedAlamat) {
            newToast({
                title: `Update Anda Belum Tersimpan`,
                description: "Simpan dahulu pembaharuan alamat Anda",
                status: 'warning'
            })
        } else if (!isTambahAlamat) {
            setIsTambahAlamat(1)
        } else {
            newToast({
                title: `Alamat Baru Belum Tersimpan`,
                description: "Simpan dahulu alamat terbaru Anda",
                status: 'warning'
            })
        }
    }

    // & onCLick untuk simpan alamat yang terpilih, kalau sudah pernah pilih alamat saat onCLick meskipun ga melakukan pemilihan lagi by default akan pilih alamat yg pernah dipilih itu
    const btnSimpan = () => {

        if (isEditedAlamat) {
            newToast({
                title: `Update Anda Belum Tersimpan`,
                description: "Simpan dahulu pembaharuan alamat Anda",
                status: 'warning'
            })
        } else if (isTambahAlamat) {
            newToast({
                title: `Alamat Baru Belum Tersimpan`,
                description: "Simpan dahulu alamat terbaru Anda",
                status: 'warning'
            })
        } else if (idAddressForOngkir) {
            setIsTambahAlamat(0);
            setIsModalAddressOpen(false);

            console.log(`DARI ACCORDION idAddress ${idAddressForOngkir}, address ${addressForOngkir}, idProvince ${idProvinceForOngkir}, idCity ${idCityForOngkir}, receiverName ${receiverNameForOngkir}, receiverPhone ${receiverPhoneForOngkir}, label ${labelForOngkir}`);

        } else {
            newToast({
                title: `Alamat Belum Terpilih`,
                description: "Pilih dahulu alamat yang ingin dituju",
                status: 'warning'
            })
        }
    }

    // & onChange radio button yg akan setState value radio, value dropdown = null per pergantian radio, value ongkir = 0, aktifin hitung ulang angka total
    const handleDeliveryMethodRadio = (selectedRadioMethod) => {
        setRadioDelivery(selectedRadioMethod);
        setDeliveryDropdownValue("null");
        setOngkir(0);
        handleTotalPaymentWithoutAdmin();
    }

    // & onChange dropdown metode pengiriman yg akan setState value dropdown dan ongkir per pergantian dropdown, aktifin hitung ulang angka total
    const handleDeliveryMethodDropdown = (selectedDropdownMethod) => {
        setDeliveryDropdownValue(selectedDropdownMethod)
        if (selectedDropdownMethod == "null") {
            setOngkir(0);
            handleTotalPaymentWithoutAdmin();
            newToast({
                title: `Metode Pengiriman Belum Dipilih`,
                description: "Metode pengiriman tidak boleh kosong",
                status: 'warning'
            })
        } else {
            setOngkir(parseInt(selectedDropdownMethod.split("-")[1]));
            handleTotalPaymentWithoutAdmin();
        }
    }

    // & hitung ulang angka total pembayaran
    const handleTotalPaymentWithoutAdmin = () => {
        setTotal(0 + ongkir);
    }

    // & printList metode pengririman berdasarkan onChange radio button
    const printDelivery = (radioDelivery) => {
        let arrayDelivery = deliveryMethod[radioDelivery];
        return arrayDelivery.map((valueDelivery, indexDelivery) => {
            return (<option
                key={indexDelivery}
                value={`${valueDelivery.description}-${valueDelivery.cost[0].value}`}
            >
                <Text
                    className="font-brand"
                >
                    {
                        valueDelivery.cost[0].etd.toLowerCase().includes("hari")
                            ?
                            <>
                                {valueDelivery.service}--Rp {valueDelivery.cost[0].value.toLocaleString()}--Estimasi terkirim dalam waktu {valueDelivery.cost[0].etd.toLowerCase()}
                            </>
                            :
                            <>
                                {valueDelivery.service}--Rp {valueDelivery.cost[0].value.toLocaleString()}--Estimasi terkirim dalam waktu {valueDelivery.cost[0].etd.toLowerCase()} hari
                            </>
                    }
                </Text>
            </option>
            )
        })
    }

    //& onClick tombol file akan minta user pilih gambar resep, simpan value resep di state
    const handleImageResep = (value) => {
        console.log(`value handleImageResep`, value);
        setNewImageResep(value);
        setIsUnggahResep(1); //& untuk jaga2 di setstate = 1 jg disini
    }

    //& onClick akan simpan gambar resep, alamat terpilih, ongkir terpilih di tabel transaksi
    const btnUnggahResep = () => {
        console.log(`btnUnggahResep diklik`);
        navigate('/transactionlist');
    };
    // const btnUnggahResep = (idx=1,onClick) => {
    //     console.log(`btnUnggahResep diklik`);
    //     navigate('/transactionlist');
    //     return (<button
    //         type='button'
    //         onClick={()=>onClick(idx)}
    //         >
    //         </button>)
    // };

    return (
        <>
            <Box boxShadow='md'>
                <NavbarComponent />
            </Box>
            <div className="container py-3">
                <div
                    className="d-flex align-items-center justify-content-between"
                >
                    <Text
                        className="col-6 col-md-6 h3"
                        py={{ base: 0, md: 2 }}
                    >
                        Unggah Resep
                    </Text>
                </div>

                <Center>
                    <Box
                        w={isSmallScreen ? "75%" : "50%"}
                        className="shadow-sm"
                        style={{ backgroundColor: "var(--colorTwo)" }}
                    >
                        <Box
                            display='flex'
                            alignItems='center'
                            justifyContent='space-between'
                            pe={6}
                            pt={5}
                        >
                            <label
                                className="ps-2"
                                for='inputIdImageRecipe'
                                style={{ width: "380px" }}
                            >
                                Unggah resep dokter disini (max 1MB, .jpg/.png)
                            </label>
                            <Input
                                id='inputIdImageRecipe'
                                ref={inputIdImageRecipe}
                                type='file'
                                accept='.jpg, .png, .jpeg'
                                display='none'
                                onChange={(e) => handleImageResep(e.target.files[0])}
                            />
                            <Image
                                src={!newImageResep
                                    ?
                                    "https://images.vexels.com/media/users/3/131734/isolated/preview/05d86a9b63d1930d6298b27081ddc345-photo-preview-frame-icon.png"
                                    :
                                    URL.createObjectURL(newImageResep)
                                }
                                for='inputIdImageRecipe'
                                onClick={() => inputIdImageRecipe.current.click()}
                                style={{ width: '40%', height: 'auto' }}
                            />
                        </Box>
                        <Divider
                            variant="solid"
                            borderColor={"var(--colorSeven)"}
                            my={2}
                        />

                        {/*❗❗❗ Alamat Pengiriman */}
                        <Box>

                            <Modal
                                isOpen={isModalAddressOpen}
                                onOverlayClick={() => setIsModalAddressOpen(isModalAddressOpen)}
                                isCentered
                                size={isSmallScreen ? "md" : "xl"}
                            >
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader
                                        className="h5b"
                                    >
                                        Pilih Alamat
                                    </ModalHeader>
                                    <ModalBody>

                                        <AccorAddressComponent
                                            handleSendingToParent={handleCallbackToChild}
                                            handleSendingToParentNewAddress={handleCallbackToChildNewAddress}
                                            handleSendingToParentEditedAddress={handleCallbackToChildEditedAddress}
                                            isTambahAlamat={isTambahAlamat}
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            onClick={btnTambahAlamat}
                                            className="btn-def"
                                            width={150}
                                            me={2}
                                        >
                                            Tambah Alamat
                                        </Button>
                                        <Button
                                            onClick={btnSimpan}
                                            className="btn-def_second"
                                            width={150}
                                        >
                                            Simpan
                                        </Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                            {/* ❗❗❗ end of Alamat Pengiriman */}

                            <Box
                                display="flex"
                                alignItems="normal"
                                justifyContent="space-between"
                                p={2}
                            >
                                <VStack
                                    alignItems="start"
                                >
                                    <Text
                                        className="font-brand"
                                        as="b"
                                    >
                                        Alamat Pengiriman
                                    </Text>
                                    {idAddressForOngkir
                                        ?
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            className="font-brand"
                                            as="cite"
                                        >
                                            <Text>
                                                {receiverNameForOngkir}
                                            </Text>
                                            <Text>
                                                {receiverPhoneForOngkir}
                                            </Text>
                                            <Text>
                                                {addressForOngkir}
                                            </Text>
                                        </Box>
                                        :
                                        <Text
                                            className="font-brand"
                                            as="cite"
                                        >
                                            Pilih alamat penerima
                                        </Text>
                                    }
                                </VStack>
                                <Button
                                    p={2}
                                    color="var(--colorSix)"
                                    variant="ghost"
                                    className="iconFirst"
                                    _hover={{ backgroundColor: "var(--colorTwo)" }}
                                    onClick={() => setIsModalAddressOpen(!isModalAddressOpen)}
                                >
                                    <VStack
                                        alignItems="center"
                                    >
                                        <Text className="font-brand d-none d-md-flex" as="b">
                                            Ubah
                                        </Text>
                                        <ImLocation2
                                            fontSize="1.5em"
                                        />
                                    </VStack>
                                </Button>
                            </Box>
                            <Divider
                                borderColor={"var(--colorSeven)"}
                                my={2}
                            />

                            {/* ❗❗❗ Metode Pengiriman */}
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                ps={2}
                            >
                                <Text
                                    className="font-brand"
                                    as="b"
                                >
                                    Metode Pengiriman
                                </Text>
                                <Box
                                    pe={[4, 4, 5, 6]}
                                    py={2}
                                >
                                    <MdDeliveryDining
                                        fontSize="1.5em"
                                        color="var(--colorSix)"
                                        alignItems="center"
                                    />
                                </Box>
                            </Box>
                            <RadioGroup
                                onChange={(eRadio) => handleDeliveryMethodRadio(eRadio)}
                                value={radioDelivery}
                                ps={2}
                                pb={2}
                            >
                                <Stack direction="row">
                                    <Radio colorScheme="red" name="deliveryList" size="sm" value="jne">JNE</Radio>
                                    <Radio colorScheme="red" name="deliveryList" size="sm" value="pos">POS</Radio>
                                    <Radio colorScheme="red" name="deliveryList" size="sm" value="tiki">TIKI</Radio>
                                </Stack>
                            </RadioGroup>
                            <Select
                                px={2}
                                alignItems="left"
                                className="font-brand"
                                variant="filled"
                                style={{ fontStyle: "italic" }}
                                value={deliveryDropdownValue}
                                onChange={(e) => handleDeliveryMethodDropdown(e.target.value)}
                            >
                                <option
                                    value="null"
                                >
                                    Pilih metode pengiriman
                                </option>
                                {printDelivery(radioDelivery)}
                            </Select>
                            {/* ❗❗❗ End of Metode Pengiriman */}

                            <Divider
                                borderColor={"var(--colorSeven)"}
                                my={2}
                            />

                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="flex-end"
                                p={2}
                            >
                                <Button
                                    onClick={btnUnggahResep}
                                    // onClick={()=>btnUnggahResep(1,handleTabIndex)}
                                    className="btn-def_second"
                                    width={150}
                                // me={2}
                                >
                                    Unggah Resep
                                </Button>
                            </Box>

                        </Box>
                    </Box>
                </Center >

            </div >
        </>
    )

}

export default UploadResepPage;