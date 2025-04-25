"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, ArrowUpDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRealtimeLeads } from "@/hooks/use-realtime"
import { showNotification } from "@/components/realtime-notification"
import type { Lead } from "@/lib/supabase/types"

interface RealtimeLeadsTableProps {
  initialLeads: Lead[]
  channelMap: Record<string, string>
}

export function RealtimeLeadsTable({ initialLeads, channelMap }: RealtimeLeadsTableProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Lead>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Subscribe to realtime updates
  const { isConnected } = useRealtimeLeads<Lead>((payload) => {
    if (payload.new && payload.new.id) {
      if (!payload.old) {
        // New lead
        setLeads((prevLeads) => [payload.new, ...prevLeads])
        showNotification({
          title: "New Lead",
          message: `${payload.new.first_name || ""} ${payload.new.last_name || ""} has been added`,
          type: "success",
        })
      } else {
        // Updated lead
        setLeads((prevLeads) => prevLeads.map((lead) => (lead.id === payload.new.id ? payload.new : lead)))
        showNotification({
          title: "Lead Updated",
          message: `${payload.new.first_name || ""} ${payload.new.last_name || ""} has been updated`,
          type: "info",
        })
      }
    } else if (payload.old && payload.old.id) {
      // Deleted lead
      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== payload.old!.id))
      showNotification({
        title: "Lead Deleted",
        message: `${payload.old.first_name || ""} ${payload.old.last_name || ""} has been deleted`,
        type: "warning",
      })
    }
  })

  // Filter leads based on search term
  const filteredLeads = leads.filter((lead) => {
    const searchString = `${lead.first_name || ""} ${lead.last_name || ""} ${lead.email || ""} ${
      lead.username || ""
    }`.toLowerCase()
    return searchString.includes(searchTerm.toLowerCase())
  })

  // Sort leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    // Handle null values
    if (aValue === null) return sortDirection === "asc" ? -1 : 1
    if (bValue === null) return sortDirection === "asc" ? 1 : -1

    // Convert to strings for comparison
    aValue = String(aValue).toLowerCase()
    bValue = String(bValue).toLowerCase()

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Handle sort
  const handleSort = (field: keyof Lead) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search leads..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={isConnected ? "bg-green-100" : "bg-yellow-100"}>
            {isConnected ? "Live Updates" : "Connecting..."}
          </Badge>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("first_name")}>
                  Name
                  {sortField === "first_name" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("source")}>
                  Source
                  {sortField === "source" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("joined_at")}>
                  Joined
                  {sortField === "joined_at" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 h-8 font-medium" onClick={() => handleSort("status")}>
                  Status
                  {sortField === "status" && (
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLeads.map((lead) => (
              <TableRow key={lead.id} className="group">
                <TableCell className="font-medium">{lead.id.substring(0, 8)}</TableCell>
                <TableCell>
                  {lead.first_name} {lead.last_name}
                  {lead.email && <div className="text-xs text-muted-foreground">{lead.email}</div>}
                </TableCell>
                <TableCell>{lead.source || "Unknown"}</TableCell>
                <TableCell>{lead.channel_id ? channelMap[lead.channel_id] || "Unknown" : "None"}</TableCell>
                <TableCell>
                  {lead.joined_at ? formatDistanceToNow(new Date(lead.joined_at), { addSuffix: true }) : "Not joined"}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      lead.status === "active"
                        ? "bg-green-500"
                        : lead.status === "inactive"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }
                  >
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/leads/${lead.id}`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}

            {sortedLeads.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No leads found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
