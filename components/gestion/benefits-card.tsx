"use client"

import { DollarSign, Crown, Zap, Infinity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

const benefits = [
  {
    icon: DollarSign,
    title: "Por página leída",
    items: [
      { plan: "Free", rate: "$0.001", color: "text-gray-600" },
      { plan: "Lite", rate: "$0.004", color: "text-blue-600" },
      { plan: "Hardcore", rate: "$0.008", color: "text-purple-600" },
    ],
  },
  {
    icon: Crown,
    title: "Comisión por ventas",
    items: [{ plan: "Todas", rate: "80%", color: "text-green-600" }],
  },
  {
    icon: Infinity,
    title: "Suscripción gratuita",
    items: [{ plan: "Hardcore", rate: "100K páginas", color: "text-purple-600" }],
  },
]

export function BenefitsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-primary" />
          <span>Beneficios</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon
          return (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50"
            >
              <Icon className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{benefit.title}</h4>
                <div className="mt-1 space-y-1">
                  {benefit.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{item.plan}:</span>
                      <span className={`font-semibold ${item.color}`}>{item.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </CardContent>
    </Card>
  )
}
