import { useState } from "react"
import { Inertia } from '@inertiajs/inertia'
import { usePage } from "@inertiajs/react"
import { type SharedData} from "@/types";
import { Clock, FileText, BookMarked, ListTodo, Lightbulb, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from '../components/navbar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

const learningMethods = [
  {
    id: 1,
    title: "Pomodoro Technique",
    description: "Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer break.",
    icon: Clock,
    benefits: [
      "Improves focus and concentration",
      "Reduces mental fatigue",
      "Increases productivity",
      "Creates a sense of urgency",
    ],
  },
  {
    id: 2,
    title: "Spaced Repetition",
    description: "Review information at increasing intervals to improve long-term retention.",
    icon: ListTodo,
    benefits: [
      "Enhances long-term memory",
      "Reduces forgetting curve",
      "More efficient than cramming",
      "Ideal for memorization tasks",
    ],
  },
  {
    id: 3,
    title: "Feynman Technique",
    description: "Explain a concept in simple terms to identify gaps in your understanding.",
    icon: BookMarked,
    benefits: [
      "Identifies knowledge gaps",
      "Deepens understanding",
      "Simplifies complex concepts",
      "Improves teaching ability",
    ],
  },
  {
    id: 4,
    title: "Active Recall",
    description: "Test yourself on material instead of passively reviewing it.",
    icon: Lightbulb,
    benefits: [
      "Strengthens neural connections",
      "Improves retrieval practice",
      "Identifies weak areas",
      "More effective than re-reading",
    ],
  },
  {
    id: 5,
    title: "Mind Mapping",
    description: "Create visual diagrams to connect related concepts and ideas.",
    icon: LayoutGrid,
    benefits: [
      "Visualizes connections between ideas",
      "Enhances creative thinking",
      "Improves organization of thoughts",
      "Makes review more engaging",
    ],
  },
  {
    id: 6,
    title: "Cornell Method",
    description: "Divide your page into sections for notes, cues, and summary.",
    icon: FileText,
    benefits: [
      "Organizes notes effectively",
      "Creates built-in study questions",
      "Facilitates active review",
      "Summarizes key concepts",
    ],
  },
]

export default function DashboardPage() {
  const {auth} = usePage<SharedData>().props;
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null)
  const handleSelectMethod = (methodId: number) => {
    Inertia.visit(`/notepad?method=${methodId}`)  
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 container py-8 w-full">
        <div className="pt-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome to Learn2Learn, {auth.user.name}</h1>
          <p className="text-muted-foreground">Select a learning method below to get started with your notes.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {learningMethods.map((method) => (
            <Card
              key={method.id}
              className="overflow-hidden hover:shadow-md transition-shadow border-secondary bg-card"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-full p-2 bg-secondary text-accent-foreground">
                    <method.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <CardDescription className="line-clamp-2">{method.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-accent hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setSelectedMethod(method.id)}
                >
                  Learn More
                </Button>
                <Button
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => handleSelectMethod(method.id)}
                >
                  Use This Technique
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-center h-screen p-4">
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-screen-xl">
    {learningMethods.map((method) => (
      <Card
        key={method.id}
        className="overflow-hidden hover:shadow-md transition-shadow border-secondary bg-card"
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="rounded-full p-2 bg-secondary text-accent-foreground">
              <method.icon className="h-8 w-8" />
            </div>
            <CardTitle className="text-lg">{method.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <CardDescription className="line-clamp-2">{method.description}</CardDescription>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-accent hover:bg-accent hover:text-accent-foreground"
            onClick={() => setSelectedMethod(method.id)}
          >
            Learn More
          </Button>
          <Button
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => handleSelectMethod(method.id)}
          >
            Use Method
          </Button>
        </CardFooter>
      </Card>
    ))}
  </div>
</div>
      </main>

      <Dialog open={selectedMethod !== null} onOpenChange={(open) => !open && setSelectedMethod(null)}>
        <DialogContent className="sm:max-w-md bg-card">
          {selectedMethod !== null && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-full p-2 bg-secondary text-accent-foreground">
                    {(() => {
                      const IconComponent = learningMethods[selectedMethod - 1].icon
                      return <IconComponent className="h-8 w-8" />
                    })()}
                  </div>
                  <DialogTitle>{learningMethods[selectedMethod - 1].title}</DialogTitle>
                </div>
                <DialogDescription className="pt-2">
                  {learningMethods[selectedMethod - 1].description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Benefits:</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {learningMethods[selectedMethod - 1].benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <DialogClose asChild>
                  <Button variant="outline" className="border-accent">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => handleSelectMethod(selectedMethod)}
                >
                  Use This Technique
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
