import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fileService } from "@/services/fileService";
import { FileItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, FileText, Image, FileSpreadsheet, File, CloudUpload } from "lucide-react";
import { format } from "date-fns";

function fileIcon(type: string) {
  if (type.includes("pdf")) return <FileText className="h-4 w-4 text-destructive" />;
  if (type.includes("image")) return <Image className="h-4 w-4 text-accent" />;
  if (type.includes("sheet") || type.includes("excel")) return <FileSpreadsheet className="h-4 w-4 text-primary" />;
  return <File className="h-4 w-4 text-muted-foreground" />;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function CustomerFiles() {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      setFiles(await fileService.getByUser(user.id));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || !user) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        await fileService.upload(user.id, file);
      }
      toast({ title: `${fileList.length} file(s) uploaded` });
      load();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fileService.remove(id);
      toast({ title: "File deleted" });
      load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Files</h1>
        <p className="text-muted-foreground mt-1">Upload and manage your documents</p>
      </div>

      {/* Upload area */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-10">
          <CloudUpload className={`h-10 w-10 mb-3 ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
          <p className="text-sm font-medium">{uploading ? "Uploading…" : "Drop files here or click to upload"}</p>
          <p className="text-xs text-muted-foreground mt-1">PDF, images, documents up to 10MB</p>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
        </CardContent>
      </Card>

      {/* File list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}</div>
          ) : files.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No files uploaded yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {fileIcon(file.type)}
                        <span className="font-medium">{file.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatSize(file.size)}</TableCell>
                    <TableCell className="text-muted-foreground">{format(new Date(file.uploadedAt), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(file.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
