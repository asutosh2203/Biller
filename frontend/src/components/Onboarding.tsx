"use client";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";

// --- TypeScript Interfaces for Robustness ---

interface IFormData {
  fullName: string;
  email: string;
  jobTitle: string;
  businessName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  businessType: string;
  primaryCurrency: string;
  timeZone: string;
  startingDate: string; // ISO date string YYYY-MM-DD
  marketingPref: boolean;
  userId: string;
}

interface IFormOption {
  value: string;
  label: string;
}

interface IFormInputProps {
  label: string;
  id: keyof IFormData; // Ensure ID matches a key in IFormData
  placeholder?: string;
  hint?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: "text" | "email" | "date" | "number";
  required?: boolean;
}

interface IFormSelectProps {
  label: string;
  id: keyof IFormData;
  hint?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: IFormOption[];
  required?: boolean;
}

interface IStepProps {
  formData: IFormData;
  setFormData: React.Dispatch<React.SetStateAction<IFormData>>;
  onContinue?: () => void;
  onBack?: () => void;
  onComplete?: () => void;
}

// --- Component Imports and Reusability ---

// Icon: Package
const Package = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-package-open"
  >
    <path d="M7.82 2.19c-2.48.51-3.83 2.53-3.82 4.67v8.28c0 1.95 1.7 3.65 3.65 3.65h10.34c1.95 0 3.65-1.7 3.65-3.65v-8.28c.01-2.14-1.34-4.16-3.82-4.67L12 3.12 7.82 2.19z" />
    <path d="M12 3.12v15.98" />
    <path d="M12 3.12 7.82 2.19" />
    <path d="M12 3.12 16.18 2.19" />
    <path d="m14 7-2 2-2-2" />
    <path d="M16.18 2.19c2.48.51 3.83 2.53 3.82 4.67v10.14c0 1.95-1.7 3.65-3.65 3.65h-5.91" />
  </svg>
);

// FormInput Component (Typed)
const FormInput: React.FC<IFormInputProps> = ({
  label,
  id,
  placeholder,
  hint,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div className="mb-4">
    <label
      htmlFor={id as string}
      className="block text-sm font-medium text-gray-700 sr-only"
    >
      {label}
    </label>
    <input
      type={type}
      id={id as string}
      name={id as string}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-base transition duration-150 ease-in-out"
    />
    {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
  </div>
);

// FormSelect Component (Typed)
const FormSelect: React.FC<IFormSelectProps> = ({
  label,
  id,
  hint,
  value,
  onChange,
  options,
  required = false,
}) => (
  <div className="mb-4">
    <label
      htmlFor={id as string}
      className="block text-sm font-medium text-gray-700 sr-only"
    >
      {label}
    </label>
    <select
      id={id as string}
      name={id as string}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-base transition duration-150 ease-in-out bg-white"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
  </div>
);

// Helper function to check email validity
const isValidEmail = (email: string): boolean => /\S+@\S+\.\S+/.test(email);

// --- Step 1: User Profile (Typed) ---

const StepOne: React.FC<IStepProps> = ({
  formData,
  setFormData,
  onContinue,
}) => {
  // Type applied to event handler argument
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isStepValid = useMemo(() => {
    return formData.fullName.length > 2 && isValidEmail(formData.email);
  }, [formData]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Just a Few Details About You
      </h2>
      <p className="text-gray-500">Help us personalize your experience.</p>

      <FormInput
        id="fullName"
        label="Full Name"
        placeholder="John Smith"
        hint="As you'd like it to appear on documents."
        value={formData.fullName}
        onChange={handleChange}
        required
      />

      <FormInput
        id="email"
        label="Email Address"
        placeholder="john.smith@example.com"
        hint="We'll use this for important notifications."
        value={formData.email}
        onChange={handleChange}
        type="email"
        required
      />

      <FormInput
        id="jobTitle"
        label="Job Title / Role"
        placeholder="Owner, Manager, Administrator"
        hint="Your primary role in the business."
        value={formData.jobTitle}
        onChange={handleChange}
      />

      <div className="flex justify-end pt-4">
        <button
          onClick={onContinue}
          disabled={!isStepValid}
          className={`px-6 py-3 text-lg font-medium rounded-lg shadow-md transition duration-200 ease-in-out
                        ${
                          isStepValid
                            ? "bg-sky-600 text-white hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300"
                            : "bg-sky-200 text-sky-400 cursor-not-allowed"
                        }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// --- Step 2: Business Details (Typed) ---

const businessTypeOptions: IFormOption[] = [
  { value: "Retail Store", label: "Retail Store" },
  { value: "Wholesale Distributor", label: "Wholesale Distributor" },
  { value: "Service Provider", label: "Service Provider" },
  { value: "E-commerce", label: "E-commerce" },
  { value: "Manufacturing", label: "Manufacturing" },
  { value: "Other", label: "Other (Please Specify)" },
];

const StepTwo: React.FC<IStepProps> = ({
  formData,
  setFormData,
  onContinue,
  onBack,
}) => {
  // Type applied to event handler argument
  const handleChange = (e: any) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isStepValid = useMemo(() => {
    return (
      formData.businessName.length > 1 &&
      formData.addressLine1.length > 5 &&
      formData.city.length > 1 &&
      formData.businessType !== ""
    );
  }, [formData]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Your Business Details
      </h2>
      <p className="text-gray-500">
        This helps us tailor your billing and inventory.
      </p>

      <FormInput
        id="businessName"
        label="Business Name"
        placeholder="Smith & Co. Trading"
        hint="The legal name of your business."
        value={formData.businessName}
        onChange={handleChange}
        required
      />

      <FormSelect
        id="businessType"
        label="Type of Business"
        hint="Helps us recommend relevant features."
        value={formData.businessType}
        onChange={handleChange}
        options={businessTypeOptions}
        required
      />

      <div className="pt-2">
        <h3 className="text-lg font-medium text-gray-700 mb-4 border-t pt-4">
          Business Address
        </h3>
        <FormInput
          id="addressLine1"
          label="Address Line 1"
          placeholder="123 Main St."
          value={formData.addressLine1}
          onChange={handleChange}
          required
        />
        <FormInput
          id="addressLine2"
          label="Address Line 2 (Optional)"
          placeholder="Suite B"
          value={formData.addressLine2}
          onChange={handleChange}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            id="city"
            label="City"
            placeholder="New York"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <FormInput
            id="postalCode"
            label="Postal Code"
            placeholder="10001"
            value={formData.postalCode}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 text-lg font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 ease-in-out"
        >
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!isStepValid}
          className={`px-6 py-3 text-lg font-medium rounded-lg shadow-md transition duration-200 ease-in-out
                        ${
                          isStepValid
                            ? "bg-sky-600 text-white hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300"
                            : "bg-sky-200 text-sky-400 cursor-not-allowed"
                        }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

// --- Step 3: Final Touches & Preferences (Typed) ---

const currencyOptions: IFormOption[] = [
  { value: "USD", label: "USD ($) - US Dollar" },
  { value: "EUR", label: "EUR (€) - Euro" },
  { value: "GBP", label: "GBP (£) - British Pound" },
  { value: "INR", label: "INR (₹) - Indian Rupee" },
];

const timeZoneOptions: IFormOption[] = [
  { value: "UTC", label: "UTC (Universal Coordinated Time)" },
  { value: "IST", label: "IST (Indian Standard Time)" },
  { value: "EST", label: "EST (Eastern Standard Time)" },
];

const StepThree: React.FC<IStepProps> = ({
  formData,
  setFormData,
  onComplete,
  onBack,
}) => {
  // Type applied to event handler argument
  const handleChange = (e: any) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, marketingPref: e.target.checked }));
  };

  const isStepValid = useMemo(() => {
    return formData.primaryCurrency !== "" && formData.timeZone !== "";
  }, [formData]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Final Touches & Preferences
      </h2>
      <p className="text-gray-500">These can be changed later in settings.</p>

      <FormSelect
        id="primaryCurrency"
        label="Primary Currency"
        hint="All financial reports will use this currency."
        value={formData.primaryCurrency}
        onChange={handleChange}
        options={currencyOptions}
        required
      />

      <FormSelect
        id="timeZone"
        label="Time Zone"
        hint="For accurate transaction timestamps."
        value={formData.timeZone}
        onChange={handleChange}
        options={timeZoneOptions}
        required
      />

      <FormInput
        id="startingDate"
        label="Starting Inventory Date"
        placeholder="2025-01-01"
        hint="When you'd like your inventory tracking to begin from."
        value={formData.startingDate}
        onChange={handleChange}
        type="date"
      />

      <div className="flex items-center pt-2">
        <input
          id="marketingPref"
          name="marketingPref"
          type="checkbox"
          checked={formData.marketingPref}
          onChange={handleCheckboxChange} // Dedicated handler for boolean state
          className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
        />
        <label
          htmlFor="marketingPref"
          className="ml-2 block text-sm text-gray-900"
        >
          Subscribe to our newsletter for tips & updates.
        </label>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 text-lg font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 ease-in-out"
        >
          Back
        </button>
        <button
          onClick={onComplete}
          disabled={!isStepValid}
          className={`px-6 py-3 text-lg font-medium rounded-lg shadow-md transition duration-200 ease-in-out
                        ${
                          isStepValid
                            ? "bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
                            : "bg-green-200 text-green-400 cursor-not-allowed"
                        }`}
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
};

// --- Main Application Component (Typed) ---

const Onboarding: React.FC = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.user);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const APP_NAME = "Biller";

  // Initial state object is explicitly typed
  const initialFormData: IFormData = {
    // Step 1
    fullName: "",
    email: "",
    jobTitle: "",
    // Step 2
    businessName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    businessType: "Retail Store",
    // Step 3
    primaryCurrency: "INR",
    timeZone: "IST",
    startingDate: new Date().toISOString().substring(0, 10), // Default to today
    marketingPref: false,
    userId: "",
  };

  // useState is explicitly typed with IFormData
  const [formData, setFormData] = useState<IFormData>(initialFormData);

  // Functionality for navigation
  const handleBack = (): void => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleContinue = (): void => {
    // You'd add step-specific validation logic here before moving
    setCurrentStep((prev) => Math.min(3, prev + 1));
  };

  const handleSubmit = async () => {
    formData.userId = user.currentUser?.id!;

    // Implement navigation to the main application
    try {
      const res = await fetch("http://localhost:5001/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // this sends cookies along with the request
        body: JSON.stringify(formData),
      });

      // res.text().then((data) => console.log(data));
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 3. Render the appropriate step component
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            formData={formData}
            setFormData={setFormData}
            onContinue={handleContinue}
          />
        );
      case 2:
        return (
          <StepTwo
            formData={formData}
            setFormData={setFormData}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <StepThree
            formData={formData}
            setFormData={setFormData}
            onComplete={handleSubmit}
            onBack={handleBack}
          />
        );
      default:
        return <div className="text-red-500">Error: Invalid Step</div>;
    }
  };

  // Helper to determine progress bar width
  const progressWidth: string = `${(currentStep / 3) * 100}%`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8 font-['Inter',_sans-serif]">
      <style>{`
                /* Font import for a professional look */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
            `}</style>

      {/* Main Onboarding Card (Desktop Sizing) */}
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-8 md:p-12 lg:p-16 border border-gray-100 transform transition duration-500 ease-in-out">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Package className="w-8 h-8 text-sky-600" />
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              {APP_NAME.toUpperCase()}
            </h1>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome to {APP_NAME}! Let's Get Your Business Set Up.
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <p className="text-sm font-medium text-sky-600 mb-2 text-center">
            Step {currentStep} of 3
          </p>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: progressWidth }}
            ></div>
          </div>
        </div>

        {/* Form Content Area */}
        <div className="max-w-xl mx-auto">{renderStep()}</div>
      </div>
    </div>
  );
};

export default Onboarding;
