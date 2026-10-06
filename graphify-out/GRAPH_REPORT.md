# Graph Report — DeepBooks  (2026-10-06)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 917 nodes · 2266 edges · 43 communities (36 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 40
- Community 41

## God Nodes (most connected - your core abstractions)
1. `cn()` - 228 edges
2. `react` - 67 edges
3. `lucide-react` - 50 edges
4. `Button` - 48 edges
5. `Card` - 30 edges
6. `CardContent` - 30 edges
7. `framer-motion` - 28 edges
8. `getServerClient()` - 26 edges
9. `missingSupabaseResponse()` - 26 edges
10. `next` - 20 edges

## Surprising Connections (you probably didn't know these)
- `ResizableHandle()` --calls--> `cn()`  [EXTRACTED]
  components/ui/resizable.tsx → lib/utils.ts
- `ResizablePanelGroup()` --calls--> `cn()`  [EXTRACTED]
  components/ui/resizable.tsx → lib/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  components/ui/alert-dialog.tsx → lib/utils.ts
- `CommandShortcut()` --calls--> `cn()`  [EXTRACTED]
  components/ui/command.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (43 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (69): BibliotecaPage(), MomentosPage(), MomentosPageProps, GestionPage(), MercadoPage(), ProfilePage(), WritePage(), BookBiblio() (+61 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (41): ReadPage(), ReadPageProps, Status, UploadDialog(), UploadDialogProps, ListingRef, PublishDialog(), Status (+33 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (36): dynamic, errorStatus(), POST(), DELETE(), dynamic, errorStatus(), disabledResponse(), dynamic (+28 more)

### Community 3 - "Community 3"
Cohesion: 0.03
Nodes (60): dependencies, autoprefixer, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, @emotion/is-prop-valid (+52 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (46): AccordionContent, AccordionItem, AccordionTrigger, CardDescription, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel (+38 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (39): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+31 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (31): Input, Separator, Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup, SidebarGroupAction (+23 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (27): BookAmbientRow, BookInfoPage(), BookInfoPageProps, AmbientIntensityControl(), AmbientIntensityControlProps, OPTIONS, BookCover(), BookCoverProps (+19 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (26): HomePage(), BookCardProps, BooksCarousel(), BooksCarouselProps, BooksCarouselsSection(), carouselSections, CategoryFilter(), SearchResultItemProps (+18 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (23): dynamic, PATCH(), RouteParams, dynamic, GET(), MomentoWithAnchor, RouteParams, dynamic (+15 more)

### Community 10 - "Community 10"
Cohesion: 0.07
Nodes (22): Checkbox, HoverCardContent, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot, PopoverContent, ResizableHandle() (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (17): decodeEntities(), extOf(), parseDocument(), parseDocx(), parseEpub(), parsePdf(), parseTxt(), xhtmlToText() (+9 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (24): name, private, version, autoprefixer, date-fns, @emotion/is-prop-valid, geist, @hookform/resolvers (+16 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (15): AnchorSection, buildSystemPrompt(), buildUserMessage(), chatCompletion(), ChatOptions, ChatResponse, ContextChunk, MAX_PROMPT_CHARS (+7 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 15 - "Community 15"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 16 - "Community 16"
Cohesion: 0.18
Nodes (12): Alert, AlertDescription, AlertTitle, alertVariants, ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle (+4 more)

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (13): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+5 more)

### Community 18 - "Community 18"
Cohesion: 0.17
Nodes (14): Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext, CarouselOptions (+6 more)

### Community 19 - "Community 19"
Cohesion: 0.25
Nodes (12): AMBIENT_PROMPT_BANK, AmbientPromptItem, pickAmbientPrompt(), VALID_KINDS, GenerateInput, RETRIEVAL_K, AmbientInput, AmbientResult (+4 more)

### Community 20 - "Community 20"
Cohesion: 0.22
Nodes (10): dynamic, GET(), PATCH(), RouteParams, patch(), validateContent(), MatchChunkRow, BookContext (+2 more)

### Community 21 - "Community 21"
Cohesion: 0.16
Nodes (7): inter, metadata, RootLayout(), ThemeProvider(), ToasterProps, next-themes, sonner

### Community 22 - "Community 22"
Cohesion: 0.19
Nodes (12): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+4 more)

### Community 23 - "Community 23"
Cohesion: 0.28
Nodes (10): dynamic, missingOpenRouterResponse(), POST(), dynamic, missingOpenRouterResponse(), POST(), post(), buildGenerateDeps() (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.23
Nodes (9): ChunkOptions, chunkText(), EmbeddingResponse, EmbedOptions, embedTexts(), baseName(), ingestDocument(), IngestInput (+1 more)

### Community 25 - "Community 25"
Cohesion: 0.24
Nodes (11): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartStyle(), ChartTooltipContent, getPayloadConfigFromPayload() (+3 more)

### Community 26 - "Community 26"
Cohesion: 0.20
Nodes (10): Command, CommandDialog(), CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator (+2 more)

### Community 27 - "Community 27"
Cohesion: 0.24
Nodes (9): ButtonProps, Pagination(), PaginationContent, PaginationEllipsis(), PaginationItem, PaginationLink(), PaginationLinkProps, PaginationNext() (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.24
Nodes (9): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants (+1 more)

### Community 29 - "Community 29"
Cohesion: 0.22
Nodes (8): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator(), @radix-ui/react-slot

### Community 30 - "Community 30"
Cohesion: 0.28
Nodes (8): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport, @radix-ui/react-navigation-menu

### Community 31 - "Community 31"
Cohesion: 0.28
Nodes (8): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, @radix-ui/react-select

### Community 32 - "Community 32"
Cohesion: 0.22
Nodes (8): extends, rules, no-unused-vars, prefer-const, react-hooks/exhaustive-deps, @typescript-eslint/no-unused-vars, next/core-web-vitals, next/typescript

### Community 33 - "Community 33"
Cohesion: 0.25
Nodes (8): devDependencies, postcss, tailwindcss, @types/node, @types/react, @types/react-dom, typescript, vitest

### Community 34 - "Community 34"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test

### Community 36 - "Community 36"
Cohesion: 0.50
Nodes (3): pdf-parse/lib/pdf-parse.js, PdfInfo, PdfParseResult

## Knowledge Gaps
- **262 isolated node(s):** `MomentosPageProps`, `BookBiblioProps`, `ApiBook`, `AppLayoutProps`, `SubscriptionModalProps` (+257 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 293 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 4` to `Community 0`, `Community 1`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 10`, `Community 16`, `Community 17`, `Community 18`, `Community 22`, `Community 25`, `Community 26`, `Community 27`, `Community 28`, `Community 29`, `Community 30`, `Community 31`?**
  _High betweenness centrality (0.228) - this node is a cross-community bridge._
- **What connects `MomentosPageProps`, `BookBiblioProps`, `ApiBook` to the rest of the system?**
  _262 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0648417782954766 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Community 1` to `Community 0`, `Community 4`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 10`, `Community 12`, `Community 16`, `Community 17`, `Community 18`, `Community 21`, `Community 22`, `Community 25`, `Community 26`, `Community 27`, `Community 28`, `Community 29`, `Community 30`, `Community 31`?**
  _High betweenness centrality (0.172) - this node is a cross-community bridge._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09176587301587301 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `Community 3` to `Community 12`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.073224043715847 - nodes in this community are weakly interconnected._