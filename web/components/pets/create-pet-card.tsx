// web/components/pets/CreatePetCard.tsx
"use client";

import React, { useState, useTransition, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { createPetAction } from '@/actions/petActions';
import { useToast } from '@/hooks/use-toast';
import { PetGender } from '@prisma/client';
import { Loader2, Cat, Camera, X } from 'lucide-react'; // Added Camera, X
import { uploadFilesToSupabase } from '@/lib/storageUtils'; // Reuse or adapt upload utility

interface CreatePetCardProps {
    locale: string;
    onPetAdded?: (petId: string) => void;
}

export default function CreatePetCard({ locale, onPetAdded }: CreatePetCardProps) {
    const { authUser } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [isPending, startTransition] = useTransition(); // For server action
    const [isUploading, setIsUploading] = useState(false); // For image upload
    const [error, setError] = useState<string | null>(null);

    // Form state for all fields
    const [name, setName] = useState("");
    const [breed, setBreed] = useState("");
    const [gender, setGender] = useState<PetGender | undefined>(undefined);
    const [birthDate, setBirthDate] = useState<string>(""); // Store as string from input type="date"
    const [adoptionDate, setAdoptionDate] = useState<string>("");
    const [chipNumber, setChipNumber] = useState("");
    const [weight, setWeight] = useState<string>(""); // Store as string from input type="number"
    const [description, setDescription] = useState("");
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cleanup object URLs
     useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || isPending || isUploading || !authUser) {
            if (!name.trim()) setError("請輸入寵物名字");
            return;
        }
        setError(null);
        setIsUploading(false); // Reset

        let uploadedImageUrl: string | undefined = undefined;

        // --- Wrapper async function to handle upload before transition ---
        const performSubmit = async () => {
            // 1. Upload Image if selected
            if (selectedImageFile) {
                setIsUploading(true);
                const uploadResult = await uploadFilesToSupabase(
                    [selectedImageFile], // Pass as array
                    'pets', // <<--- CHOOSE A BUCKET NAME (e.g., 'pets-images')
                    'pictures',    // <<--- Choose a subfolder (e.g., 'pictures')
                    authUser.id
                );
                setIsUploading(false);

                if (uploadResult.errors.length > 0 || uploadResult.successfulUrls.length === 0) {
                    const errMsg = uploadResult.errors[0] || "圖片上傳失敗";
                    setError(errMsg);
                    toast({ title: "上傳錯誤", description: errMsg, variant: "destructive" });
                    return; // Stop if upload failed
                }
                uploadedImageUrl = uploadResult.successfulUrls[0];
            }

            // 2. Prepare data for server action (handle type conversions)
            const petData: any = { // Use 'any' temporarily or refine type
                name: name.trim(),
                breed: breed.trim() || undefined,
                gender: gender,
                birthDate: birthDate || null, // Send null if empty string
                adoptionDate: adoptionDate || null,
                chipNumber: chipNumber.trim() || undefined,
                weight: weight ? parseFloat(weight) : null, // Convert to number or null
                description: description.trim() || undefined,
                primaryImageUrl: uploadedImageUrl || undefined, // Use uploaded URL
            };


            // 3. Start server action transition
            startTransition(async () => {
                const result = await createPetAction(petData);

                if (result.success && result.petId) {
                    toast({ description: `${name} 已成功新增！` });
                    // Reset form completely
                    setName(""); setBreed(""); setGender(undefined); setBirthDate("");
                    setAdoptionDate(""); setChipNumber(""); setWeight(""); setDescription("");
                    setSelectedImageFile(null); setImagePreview(null);
                    if(fileInputRef.current) fileInputRef.current.value = "";

                    if (onPetAdded) onPetAdded(result.petId);
                    router.push(`/${locale}/pets/${result.petId}`); // Redirect to new pet page
                } else {
                    setError(result.error || "無法新增寵物");
                    toast({ title: "錯誤", description: result.error || "無法新增寵物", variant: "destructive" });
                    // Note: Image might be uploaded but pet creation failed. Consider cleanup.
                }
            });
        };

        performSubmit(); // Execute the async wrapper
    };

    // Image Handlers
    const triggerFileInput = () => {
        if (isPending || isUploading) return;
        fileInputRef.current?.click();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
             // Validation (example: size < 5MB, type is image)
             const MAX_SIZE_MB = 5;
             if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                 toast({ title: "錯誤", description: `檔案過大 (上限 ${MAX_SIZE_MB}MB)。`, variant: "destructive" });
                 return;
             }
             const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
             if (!allowedTypes.includes(file.type)) {
                 toast({ title: "錯誤", description: `不支援的檔案格式。`, variant: "destructive" });
                 return;
             }

            setSelectedImageFile(file);
            // Create and set preview URL
            const previewUrl = URL.createObjectURL(file);
            // Revoke previous preview if exists
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImagePreview(previewUrl);
        }
        // Reset file input value
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeImage = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setSelectedImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    if (!authUser) { /* ... Login prompt ... */ }

    const isLoading = isPending || isUploading; // Combined loading state

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Cat className="h-5 w-5" /> 新增寵物資料
                </CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <p className="mb-4 text-center text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded">{error}</p>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload Section */}
                    <div className="space-y-2 flex flex-col items-center">
                         <Label>主要照片 (選填)</Label>
                         <div className="relative w-32 h-32 border rounded-full bg-muted flex items-center justify-center overflow-hidden">
                             {imagePreview ? (
                                <Image src={imagePreview} alt="Pet preview" fill className="object-cover" />
                             ) : (
                                <Cat className="w-16 h-16 text-gray-400" /> // Placeholder Icon
                             )}
                             {imagePreview && !isLoading && (
                                 <Button
                                     type="button" variant="destructive" size="icon"
                                     className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-70 hover:opacity-100"
                                     onClick={removeImage} aria-label="Remove image"
                                 >
                                     <X className="h-4 w-4"/>
                                 </Button>
                             )}
                             <Button
                                type="button" size="icon"
                                className="absolute bottom-1 right-1 h-8 w-8 rounded-full"
                                onClick={triggerFileInput} disabled={isLoading} aria-label="Upload image"
                             >
                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Camera className="h-4 w-4" />}
                             </Button>
                             <input type="file" ref={fileInputRef} onChange={handleImageChange}
                                accept="image/png, image/jpeg, image/webp" style={{ display: 'none' }} disabled={isLoading} />
                         </div>
                    </div>

                    {/* Grid for text inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="pet-name">名字 <span className="text-destructive">*</span></Label>
                            <Input id="pet-name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} maxLength={100} />
                        </div>
                        {/* Breed */}
                        <div className="space-y-1.5">
                            <Label htmlFor="pet-breed">品種</Label>
                            <Input id="pet-breed" value={breed} onChange={(e) => setBreed(e.target.value)} disabled={isLoading} maxLength={100} />
                        </div>
                         {/* Gender */}
                         <div className="space-y-1.5">
                             <Label htmlFor="pet-gender">性別</Label>
                             <Select value={gender} onValueChange={(v) => setGender(v as PetGender)} disabled={isLoading}>
                                <SelectTrigger id="pet-gender"><SelectValue placeholder="選擇性別" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={PetGender.MALE}>公</SelectItem>
                                    <SelectItem value={PetGender.FEMALE}>母</SelectItem>
                                    <SelectItem value={PetGender.UNKNOWN}>未知</SelectItem>
                                </SelectContent>
                             </Select>
                         </div>
                         {/* Birth Date */}
                         <div className="space-y-1.5">
                             <Label htmlFor="pet-birthdate">出生日期</Label>
                             <Input id="pet-birthdate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} disabled={isLoading} />
                         </div>
                          {/* Adoption Date */}
                         <div className="space-y-1.5">
                             <Label htmlFor="pet-adoptiondate">領養日期</Label>
                             <Input id="pet-adoptiondate" type="date" value={adoptionDate} onChange={(e) => setAdoptionDate(e.target.value)} disabled={isLoading} />
                         </div>
                          {/* Chip Number */}
                         <div className="space-y-1.5">
                             <Label htmlFor="pet-chip">晶片號碼</Label>
                             <Input id="pet-chip" value={chipNumber} onChange={(e) => setChipNumber(e.target.value)} disabled={isLoading} maxLength={50} />
                         </div>
                          {/* Weight */}
                         <div className="space-y-1.5">
                             <Label htmlFor="pet-weight">體重 (kg)</Label>
                             <Input id="pet-weight" type="number" step="0.1" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} disabled={isLoading} placeholder="例如: 5.2" />
                         </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                         <Label htmlFor="pet-description">描述</Label>
                         <Textarea
                             id="pet-description" value={description} onChange={(e) => setDescription(e.target.value)}
                             placeholder="介紹一下您的寵物..." disabled={isLoading} maxLength={1000} rows={4}
                         />
                     </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={!name.trim() || isLoading}>
                             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "儲存寵物資料"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}