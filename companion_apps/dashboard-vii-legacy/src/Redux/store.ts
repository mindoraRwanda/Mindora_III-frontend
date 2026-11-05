import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Adminslice/authSlice';
import TherapyReducer from './Adminslice/ThearpySlice';
import UserReducer from './Adminslice/UserSlice';
import PatientReducer from './Adminslice/PatientSlice';
import AppointmentReducer from './TherapistSlice/Appointment';
import AvailableSlotReducer from './TherapistSlice/Appointment_Slot';
import treatmentPlanReducer from './TherapistSlice/TreatmentPlan';
import GoalPlanReducer from './TherapistSlice/Goals';
import MilestoneReducer from './TherapistSlice/Milestones';
import rescheduleReducer from './TherapistSlice/AppointmentChange';
import AllAppointmentReducer from './Adminslice/AllAppointment';
import CommunityReducer from './Adminslice/CommunitySlice';
import CommunityPostReducer from './Adminslice/CommunityPost';
import ArticlesReducer from './Adminslice/Article_Slice';
import BillingReportsReducer from './Adminslice/BillingReportSlice';
import CourseReducer from './Adminslice/CourseSlice';
import CommentsReducer from './Adminslice/Comment';
import invoicesReducer from './TherapistSlice/Invoice';
import serviceReducer from './TherapistSlice/Service';
import medicationReducer from './TherapistSlice/MedicationSlice';
import medication_prescriptionReducer from './TherapistSlice/MedicationPrescription';
import messagesReducer from './Adminslice/messageSlice';
import reportReducer from './TherapistSlice/ReportSlice';
import permissionsSliceReducer from './Adminslice/PermissionsRedux';
import rolesSliceReducer from './Adminslice/RolesRedux';
const store = configureStore({
  reducer: {
    auth: authReducer,
    Therapy: TherapyReducer,
    users: UserReducer,
    patients: PatientReducer,
    appointment: AppointmentReducer,
    availableSlot: AvailableSlotReducer,
    treatmentPlan: treatmentPlanReducer,
    goalPlan: GoalPlanReducer,
    milestone: MilestoneReducer,
    reschedule: rescheduleReducer,
    AllAppointment: AllAppointmentReducer,
    Community: CommunityReducer,
    CommunityPost: CommunityPostReducer,
    articleContent: ArticlesReducer,
    BillingReports: BillingReportsReducer,
    courses: CourseReducer,
    Postcomment: CommentsReducer,
    invoice: invoicesReducer,
    servicess: serviceReducer,
    Medication: medicationReducer,
    MedicationPrescription: medication_prescriptionReducer,
    messages: messagesReducer,
    reports: reportReducer,
    permissions:permissionsSliceReducer,
    roles: rolesSliceReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;