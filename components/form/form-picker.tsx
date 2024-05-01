"use client";

import { IMAGES } from "@/constants/images";
import { unsplash } from "@/lib/unsplash";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import FormErrors from "./form-errors";

interface FormPickerProps {
    id: string;
    errors?: Record<string, string[] | undefined>;
};


const FormPicker = (props: FormPickerProps) => {

    const { id, errors } = props;

    const [images, setImages] = useState<Array<Record<string, any>>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState(null);

    const { pending } = useFormStatus();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setIsLoading(true);
                const results = await unsplash.photos.getRandom({
                    collectionIds: ["317099"],
                    count: 9,
                });

                if (results && results.response) {
                    const resultsImages = (results.response as Array<Record<string, any>>);
                    setImages(resultsImages);
                } else {
                    toast.error("Failed to fetch images from unsplash!💀")
                }

            } catch (error) {
                toast.error("Failed to fetch new images from unsplash!💀")
                console.log(error);
                setImages([IMAGES]);//TODO add IMAGES const to error case
            } finally {
                setIsLoading(false);
            }
        }
        // fetchImages();TODO: activate in Production
        setImages(IMAGES as Array<Record<string, any>>)
    }, []);

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
            </div>
        )
    }

    const onClick = (img: Record<string, any>) => {
        if (pending) return;
        setSelectedImageId(img.id);
    }

    return (
        <div className="relative">
            <div className="grid grid-cols-3 gap-2 mb-2">
                {
                    images.map((img) => (
                        <div className={cn("cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted", pending && "opacity-50 hover:opacity-50 cursor-auto")} key={img.id} onClick={() => onClick(img)}>
                            <input type="radio" id={id} name={id} className="hidden" checked={selectedImageId === img.id} disabled={pending} value={`${img.id}|${img.urls.thumb}|${img.urls.full}|${img.links.html}|${img.user.name}`} />
                            <Image fill src={img.urls.thumb} alt={img.alt_description} className="object-cover rounded-sm" />
                            {
                                selectedImageId === img.id && (
                                    <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                                        <Check className="h-4 w-4 text-white" />
                                    </div>
                                )
                            }
                            <Link href={img.links.html} target="_blank" className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50">
                                {
                                    img.user.name
                                }
                            </Link>
                        </div>
                    ))
                }
            </div>
            <FormErrors id={id} errors={errors} />
        </div>
    )
}

export default FormPicker