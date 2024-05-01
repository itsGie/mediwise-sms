import React, { useEffect, useState } from "react";
import MediwiseLoginModal from "../modals/mediwise/MediwiseLoginModal";
import AddWorkScheduleModal from "../modals/mediwise/AddWorkScheduleModal";
import CreateBarangayItemModal from "../modals/mediwise/CreateBarangayItemModal";
import CreateDoctorModal from "../modals/mediwise/CreateDoctorModal";
import AddAppointmentModal from "../modals/mediwise/AddAppointmentModal";
import AddPrescriptionModal from "../modals/mediwise/AddPrescriptionModal";
import ViewPrescriptionModal from "../modals/mediwise/ViewPrescriptionModal";
import CreateSupplierModal from "../modals/sms/CreateSupplierModal";
import CreateBarangayModal from "../modals/sms/CreateBarangayModal";
import CreateAdminModal from "../modals/sms/CreateAdminModal";
import CreateSmsItemModal from "../modals/sms/CreateSmsItemModal";
import CreatePatientModal from "../modals/mediwise/CreatePatientModal";
import CreateEventModal from "../modals/mediwise/CreateEventModal";
import InventoryReportModal from "../modals/mediwise/InventoryReportModal";
import CreateRequestModal from "../modals/mediwise/CreateRequestModal";
import ViewRequestModal from "../modals/mediwise/ViewRequestModal";
import ManageAppointmentModal from "../modals/mediwise/ManageAppointmentModal";
import DeleteAppointmentModal from "../modals/mediwise/DeleteAppointmentModal";
import DeletePrescriptionModal from "../modals/mediwise/DeletePrescriptionModal";
import DeleteBarangayItemModal from "../modals/mediwise/DeleteBarangayItemModal";
import UpdateBarangayItemModal from "../modals/mediwise/UpdateBarangayItemModal";
import DeleteSmsItemModal from "../modals/sms/DeleteSmsItemModal";
import UpdateSmsItemModal from "../modals/sms/UpdateSmsItemModal";
import DeleteEventModal from "../modals/mediwise/DeleteEventModal";
import RecheduleAppointmentModal from "../modals/mediwise/RescheduleAppointmentModal";
import AddNewItemStockModal from "../modals/mediwise/AddNewItemStockModal";
import AddNewItemStockModalSms from "../modals/sms/AddNewItemStockModal";
import DeleteAnnouncementModal from "../modals/mediwise/DeleteAnnouncementModal";
import ViewPhotoModal from "../modals/mediwise/ViewPhotoModal";
import RegistrationTermsAndCondition from "../modals/mediwise/RegistrationTermsAndCondition";
import AppointmentSideModal from "../modals/mediwise/AppointmentSideModal";
import AddDoctorScheduleModal from "../modals/mediwise/AddDoctorScheduleModal";
import UpdatePrescriptionModal from "../modals/mediwise/UpdatePrescriptionModal";
import ConfirmRequestModal from "../modals/mediwise/ConfirmRequestModal";
import CreateCategoryModal from "../modals/sms/CreateCategoryModal";
import UpdateCategoryModal from "../modals/sms/UpdateCategoryModal";
import AppointmentWarningModal from "../modals/mediwise/AppointmentWarningModal";
import DeleteModal from "../modals/shared/DeleteModal";


const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <MediwiseLoginModal />
      <AddWorkScheduleModal />
      <CreateBarangayItemModal />
      <CreateDoctorModal />
      <AddAppointmentModal />
      <AddPrescriptionModal />
      <ViewPrescriptionModal />
      <CreateSupplierModal />
      <CreateBarangayModal />
      <CreateAdminModal />
      <CreateSmsItemModal />
      <CreatePatientModal />
      <CreateEventModal />
      <InventoryReportModal />
      <CreateRequestModal />
      <ViewRequestModal />
      <ManageAppointmentModal />
      <DeleteAppointmentModal />
      <DeletePrescriptionModal />
      <DeleteBarangayItemModal />
      <UpdateBarangayItemModal />
      <DeleteSmsItemModal />
      <UpdateSmsItemModal />
      <DeleteEventModal />
      <DeleteAnnouncementModal />
    <RecheduleAppointmentModal />
    <AddNewItemStockModal />
    <AddNewItemStockModalSms />
    <ViewPhotoModal />
    <RegistrationTermsAndCondition />
    <AppointmentSideModal />
    <AddDoctorScheduleModal />
    <UpdatePrescriptionModal />
    <ConfirmRequestModal />
    <CreateCategoryModal />
    <UpdateCategoryModal />
    <AppointmentWarningModal />
    <DeleteModal />
    </>
  );
};

export default ModalProvider;
