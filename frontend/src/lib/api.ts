const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

type ApiValidationError = {
  loc?: (string | number)[];
  msg?: string;
};

type ApiErrorResponse = {
  detail?: string | ApiValidationError[];
};

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly fieldErrors: { field: string; message: string }[] = [],
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export type SubmissionReceipt = {
  id: number;
  submittedAt: string;
  emailNotificationSent?: boolean;
};

export async function submitForm(
  endpoint: string,
  payload: Record<string, string | null>,
): Promise<SubmissionReceipt> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Cannot reach the backend. Start the API server and try again.",
    );
  }

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    if (response.ok) {
      throw new Error(
        "The backend returned an invalid response. Please try again.",
      );
    }
    result = null;
  }

  if (!response.ok) {
    const errorResponse = result as ApiErrorResponse | null;
    const detail = errorResponse?.detail;
    const fieldErrors = Array.isArray(detail)
      ? detail.map((error) => ({
          field: String(error.loc?.at(-1) ?? ""),
          message: error.msg ?? "Invalid value",
        }))
      : [];
    const message = Array.isArray(detail)
      ? fieldErrors
          .map(({ field, message }) => `${field ? `${field}: ` : ""}${message}`)
          .join(" ")
      : detail;

    throw new ApiRequestError(
      message ||
        `The backend could not save this submission (${response.status}).`,
      fieldErrors,
    );
  }

  if (
    typeof result !== "object" ||
    result === null ||
    !("id" in result) ||
    typeof result.id !== "number" ||
    !Number.isInteger(result.id) ||
    !("submittedAt" in result) ||
    typeof result.submittedAt !== "string"
  ) {
    throw new Error("The backend returned an invalid receipt. Please try again.");
  }

  return {
    id: result.id,
    submittedAt: result.submittedAt,
    ...("emailNotificationSent" in result &&
    typeof result.emailNotificationSent === "boolean"
      ? { emailNotificationSent: result.emailNotificationSent }
      : {}),
  };
}
