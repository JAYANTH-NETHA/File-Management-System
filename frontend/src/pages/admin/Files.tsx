import { useState, useEffect } from "react";
import { fileService } from "@/services/fileService";
import { FileItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Trash2, FileText, Image, FileSpreadsheet, File } from "lucide-react";
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

export default function AdminFiles() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      setFiles(await fileService.getAll());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = files.filter((f) =>
    `${f.name} ${f.userName || ""}`.toLowerCase().includes(search.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold">All Files</h1>
        <p className="text-muted-foreground mt-1">Browse and manage all uploaded files</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search files…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Badge variant="secondary">{filtered.length} files</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {fileIcon(file.type)}
                        <span className="font-medium">{file.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{file.userName || file.userId}</TableCell>
                    <TableCell className="text-muted-foreground">{formatSize(file.size)}</TableCell>
                    <TableCell className="text-muted-foreground">{format(new Date(file.uploadedAt), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(file.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No files found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
