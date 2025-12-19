import * as React from "react";
import { cn } from "@/utils/cn";
import { Upload } from "lucide-react";

export interface FileUploadProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                className={cn(
                    "flex items-center justify-center w-full",
                    className
                )}
            >
                <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-32 border border-dashed rounded-2xl cursor-pointer bg-muted/50 hover:bg-muted border-border transition-colors"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">
                                Drag and drop or Browse
                            </span>
                        </p>
                    </div>
                    <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        ref={ref}
                        {...props}
                    />
                </label>
            </div>
        );
    }
);
FileUpload.displayName = "FileUpload";

export { FileUpload };
