import { toast } from "sonner";
import { Resource } from "./types";

export const downloadPdf = async (resource: Resource) => {
    try {
        // Fetch the file as a blob
        const response = await fetch(resource.fileUrl);
        const blob = await response.blob();

        // Create a temporary URL
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element
        const a = document.createElement('a');
        a.href = url;

        // Determine filename
        let fileName = resource.fileName || "download.pdf";
        if (!fileName.toLowerCase().endsWith('.pdf')) {
            fileName += '.pdf';
        }

        a.download = fileName;

        // Programmatically click
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

    } catch (error) {
        console.error("Download failed:", error);
        // Fallback to simple download which might rename the file but better than nothing
        // window.location.href = resource.fileUrl; // Or open in new tab
        toast.error("Download failed. Opening in new tab instead.");
        window.open(resource.fileUrl, "_blank");
    }
};
